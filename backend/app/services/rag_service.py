import math
import re
from typing import List, Dict, Any, Optional
from collections import Counter
from app.services.ai_service import AIService
from app.models.document import DocumentChunk

class RagService:
    @classmethod
    def _tokenize(cls, text: str) -> List[str]:
        # Fast lowercase alphanumeric tokenizer with stopword filtering
        stopwords = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
            "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", 
            "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", 
            "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", 
            "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", 
            "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", 
            "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", 
            "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", 
            "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
            "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", 
            "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", 
            "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", 
            "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", 
            "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", 
            "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", 
            "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours"
        }
        tokens = re.findall(r"\b[a-zA-Z0-9_]{2,}\b", text.lower())
        return [t for t in tokens if t not in stopwords]

    @classmethod
    def retrieve_relevant_chunks(
        cls,
        query: str,
        chunks: List[DocumentChunk],
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        """Ultra-fast, zero-overhead BM25/TF-IDF similarity retrieval."""
        if not chunks:
            return []

        query_tokens = cls._tokenize(query)
        if not query_tokens:
            query_tokens = [w.lower() for w in query.split() if len(w) > 1]

        query_tf = Counter(query_tokens)
        doc_count = len(chunks)

        # Document frequencies
        df = Counter()
        chunk_token_lists = []
        for chunk in chunks:
            tokens = cls._tokenize(chunk.content)
            chunk_token_lists.append(tokens)
            for token in set(tokens):
                df[token] += 1

        # Calculate scores
        scored_chunks = []
        for i, chunk in enumerate(chunks):
            tokens = chunk_token_lists[i]
            if not tokens:
                scored_chunks.append((0.0, chunk))
                continue

            chunk_tf = Counter(tokens)
            doc_len = len(tokens)
            score = 0.0

            for q_term, q_count in query_tf.items():
                if q_term in chunk_tf:
                    tf = chunk_tf[q_term] / max(doc_len, 1)
                    # IDF with smoothing
                    idf = math.log((doc_count + 1) / (df.get(q_term, 0) + 1)) + 1.0
                    score += tf * idf * q_count

            scored_chunks.append((score, chunk))

        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, chunk in scored_chunks[:top_k]:
            doc_title = getattr(chunk.document, "title", "Document") if hasattr(chunk, "document") else "Document"
            results.append({
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "document_title": doc_title,
                "page_number": chunk.page_number,
                "content": chunk.content,
                "score": round(float(score), 4)
            })

        return results

    @classmethod
    async def answer_with_rag(
        cls,
        query: str,
        relevant_chunks: List[Dict[str, Any]],
        learning_mode: str = "exam_prep"
    ) -> Dict[str, Any]:
        """Synthesizes grounded answer strictly referencing retrieved chunks with citations."""
        if not relevant_chunks:
            return {
                "answer": "No relevant course notes or documents were found to answer this question. Please upload notes or select a different document.",
                "citations": []
            }

        # Build context block with explicit citation anchors
        context_parts = []
        citations = []
        for i, item in enumerate(relevant_chunks):
            citation_tag = f"[Doc: {item['document_title']}, Page: {item['page_number']}]"
            context_parts.append(f"Source Excerpt {i+1} {citation_tag}:\n\"{item['content']}\"")
            citations.append({
                "citation_id": i + 1,
                "document_id": item["document_id"],
                "document_title": item["document_title"],
                "page_number": item["page_number"],
                "snippet": item["content"][:220] + "..." if len(item["content"]) > 220 else item["content"],
                "relevance_score": item["score"]
            })

        context_str = "\n\n".join(context_parts)
        mode_instruction = AIService._get_learning_mode_instructions(learning_mode)

        system_instruction = (
            "You are Exam Buddy's RAG-Based AI PDF Tutor. Your job is to provide accurate, grounded answers "
            "based strictly on the student's uploaded documents.\n"
            f"Active Learning Mode: [{learning_mode.upper()}]. {mode_instruction}\n"
            "CRITICAL INSTRUCTIONS:\n"
            "1. Ground your response in the provided Source Excerpts.\n"
            "2. Whenever you state a fact or definition, explicitly cite the source like [Doc: <Title>, Page <PageNumber>].\n"
            "3. If the provided excerpts do not contain the complete answer, state clearly what was found in the document and note what is missing."
        )

        prompt = (
            f"Document Source Excerpts:\n```\n{context_str}\n```\n\n"
            f"Student Question: {query}\n\n"
            f"Provide a well-structured, citation-backed answer:"
        )

        answer_text = await AIService.call_llm(prompt, system_instruction)

        return {
            "answer": answer_text,
            "citations": citations
        }
