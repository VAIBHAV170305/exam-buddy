import os
import shutil
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.config import settings
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentChunk
from app.schemas.document import DocumentOut, DocumentDetailOut, DocumentUpdate
from app.services.doc_service import DocumentService

router = APIRouter()

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt", "md"}

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    subject: Optional[str] = Form("General"),
    category_folder: Optional[str] = Form("Default"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    filename = file.filename or "uploaded_file"
    ext = filename.split(".")[-1].lower() if "." in filename else "txt"
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, DOCX, TXT."
        )

    # Save file on disk
    user_upload_dir = os.path.join(settings.UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_upload_dir, exist_ok=True)
    file_path = os.path.join(user_upload_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    # Process and extract text
    extracted_text, pages = DocumentService.process_file(file_path, ext)
    page_count = max(len(pages), 1)

    doc_title = title.strip() if title and title.strip() else filename

    # Create document record
    doc = Document(
        user_id=current_user.id,
        title=doc_title,
        subject=subject or "General",
        category_folder=category_folder or "Default",
        file_type=ext,
        file_name=filename,
        file_path=file_path,
        file_size=file_size,
        page_count=page_count,
        extracted_text=extracted_text,
        summary=extracted_text[:300] + "..." if len(extracted_text) > 300 else extracted_text
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Generate and store semantic chunks
    chunks_data = DocumentService.chunk_document(pages, chunk_size=500, overlap=100)
    for c in chunks_data:
        chunk_obj = DocumentChunk(
            document_id=doc.id,
            chunk_index=c["chunk_index"],
            page_number=c["page_number"],
            content=c["content"]
        )
        db.add(chunk_obj)
    db.commit()

    return doc

@router.get("", response_model=List[DocumentOut])
def list_documents(
    subject: Optional[str] = Query(None),
    category_folder: Optional[str] = Query(None),
    is_bookmarked: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    query = db.query(Document).filter(Document.user_id == current_user.id)
    if subject:
        query = query.filter(Document.subject == subject)
    if category_folder:
        query = query.filter(Document.category_folder == category_folder)
    if is_bookmarked is not None:
        query = query.filter(Document.is_bookmarked == is_bookmarked)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Document.title.ilike(search_fmt)) |
            (Document.subject.ilike(search_fmt)) |
            (Document.extracted_text.ilike(search_fmt))
        )

    return query.order_by(Document.created_at.desc()).all()

@router.get("/{document_id}", response_model=DocumentDetailOut)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc

@router.put("/{document_id}", response_model=DocumentOut)
def update_document(
    document_id: int,
    update_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    if update_data.title is not None:
        doc.title = update_data.title
    if update_data.subject is not None:
        doc.subject = update_data.subject
    if update_data.category_folder is not None:
        doc.category_folder = update_data.category_folder
    if update_data.is_bookmarked is not None:
        doc.is_bookmarked = update_data.is_bookmarked

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Remove file on disk if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(path=doc.file_path, filename=doc.file_name)

@router.get("/meta/taxonomy")
def get_metadata_taxonomy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    subjects = sorted(list({d.subject for d in docs if d.subject}))
    folders = sorted(list({d.category_folder for d in docs if d.category_folder}))
    return {
        "subjects": subjects if subjects else ["General", "Operating Systems", "Data Structures", "Mathematics"],
        "folders": folders if folders else ["Default", "Lecture Notes", "Textbooks", "Exam Prep"]
    }
