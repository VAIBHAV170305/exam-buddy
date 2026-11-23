import os
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Tuple
import aiofiles

class DocumentService:
    @staticmethod
    def extract_text_from_txt(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        """Reads plain text file and breaks it into logical pages/sections."""
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        
        # Split into pseudo-pages every ~1500 characters
        pages = []
        page_size = 1500
        total_len = len(content)
        page_num = 1
        
        if total_len == 0:
            return "", [{"page_number": 1, "text": ""}]

        for i in range(0, total_len, page_size):
            chunk = content[i : i + page_size]
            pages.append({"page_number": page_num, "text": chunk})
            page_num += 1

        return content, pages

    @staticmethod
    def extract_text_from_docx(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        """Extracts text from DOCX using standard python zipfile & XML."""
        paragraphs = []
        try:
            with zipfile.ZipFile(file_path, 'r') as docx_zip:
                xml_content = docx_zip.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                # Word namespace
                ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                for p in tree.findall('.//w:p', ns):
                    texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                    if texts:
                        paragraphs.append("".join(texts))
        except Exception as e:
            paragraphs.append(f"[Error parsing DOCX file: {str(e)}]")

        full_text = "\n\n".join(paragraphs)
        pages = []
        page_size = 1500
        page_num = 1
        for i in range(0, max(len(full_text), 1), page_size):
            chunk = full_text[i : i + page_size]
            pages.append({"page_number": page_num, "text": chunk})
            page_num += 1

        return full_text, pages

    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        """Extracts text from PDF using pypdf if available, or native PDF stream parser."""
        pages = []
        full_text_list = []

        # Attempt with pypdf
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append({"page_number": idx + 1, "text": text.strip()})
                full_text_list.append(text.strip())
            return "\n\n".join(full_text_list), pages
        except Exception:
            pass

        # Attempt with fitz (PyMuPDF)
        try:
            import fitz
            doc = fitz.open(file_path)
            for idx, page in enumerate(doc):
                text = page.get_text() or ""
                pages.append({"page_number": idx + 1, "text": text.strip()})
                full_text_list.append(text.strip())
            return "\n\n".join(full_text_list), pages
        except Exception:
            pass

        # Native fallback PDF stream parser for plain text in PDF
        try:
            with open(file_path, "rb") as f:
                raw_bytes = f.read()
            raw_text = raw_bytes.decode("latin-1", errors="ignore")
            # Find stream objects and text blocks BT ... ET
            text_chunks = []
            matches = re.findall(r"\((.*?)\)\s*Tj", raw_text)
            if matches:
                text_chunks = matches
            else:
                matches_bracket = re.findall(r"\[(.*?)\]\s*TJ", raw_text)
                for item in matches_bracket:
                    sub_matches = re.findall(r"\((.*?)\)", item)
                    text_chunks.extend(sub_matches)
            
            extracted = " ".join(text_chunks).strip()
            if not extracted:
                extracted = "[PDF text parsed - Document contains binary or scanned elements]"
            
            pages = [{"page_number": 1, "text": extracted}]
            return extracted, pages
        except Exception as e:
            err_msg = f"[Could not read PDF contents: {str(e)}]"
            return err_msg, [{"page_number": 1, "text": err_msg}]

    @classmethod
    def process_file(cls, file_path: str, file_type: str) -> Tuple[str, List[Dict[str, Any]]]:
        file_type = file_type.lower()
        if file_type in ["txt", "text", "md"]:
            return cls.extract_text_from_txt(file_path)
        elif file_type in ["docx", "doc"]:
            return cls.extract_text_from_docx(file_path)
        elif file_type == "pdf":
            return cls.extract_text_from_pdf(file_path)
        else:
            return cls.extract_text_from_txt(file_path)

    @staticmethod
    def chunk_document(pages: List[Dict[str, Any]], chunk_size: int = 500, overlap: int = 100) -> List[Dict[str, Any]]:
        """Splits page contents into overlapping semantic chunks with page citations."""
        chunks = []
        chunk_idx = 0

        for page in pages:
            page_num = page.get("page_number", 1)
            text = page.get("text", "").strip()
            if not text:
                continue

            start = 0
            text_len = len(text)

            while start < text_len:
                end = min(start + chunk_size, text_len)
                chunk_text = text[start:end].strip()
                if chunk_text:
                    chunks.append({
                        "chunk_index": chunk_idx,
                        "page_number": page_num,
                        "content": chunk_text
                    })
                    chunk_idx += 1
                if end == text_len:
                    break
                start += (chunk_size - overlap)

        return chunks
