-- Migration to add question text fields to quiz_questions table
ALTER TABLE quiz_questions 
ADD COLUMN question_text_hu TEXT,
ADD COLUMN question_text_en TEXT;
