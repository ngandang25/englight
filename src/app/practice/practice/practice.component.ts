import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../../core/service/gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

interface PracticeQuestion {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent implements OnInit {
  questions: PracticeQuestion[] = [];
  userAnswers: string[] = [];
  loading = false;
  error = '';
  submitted = false;
  score = 0;

  constructor(private geminiService: GeminiService) { }

  ngOnInit(): void {
    // this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.error = '';
    this.questions = [];
    this.userAnswers = [];
    this.submitted = false;
    this.score = 0;
    const prompt = `Hãy tạo 10 bài tập trắc nghiệm tiếng Anh trình độ pre-intermediate. Mỗi bài tập là một object JSON với các trường: question (câu hỏi), options (mảng 4 đáp án), answer (đáp án đúng, là 1 trong 4 đáp án). Trả về một mảng JSON.`;
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        try {
          const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const match = text.match(/\[.*\]/s);
          if (match) {
            const arr = JSON.parse(match[0]);
            if (Array.isArray(arr) && arr.length) {
              this.questions = arr.slice(0, 10);
              this.userAnswers = new Array(this.questions.length).fill('');
            } else {
              this.error = 'Không tìm thấy dữ liệu phù hợp.';
            }
          } else {
            this.error = 'Không tìm thấy dữ liệu phù hợp.';
          }
        } catch (e) {
          this.error = 'Lỗi xử lý dữ liệu.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Lỗi: ' + (err?.error?.error?.message || err.message || 'Không xác định');
        this.loading = false;
      }
    });
  }

  submit() {
    this.submitted = true;
    this.score = this.questions.reduce((acc, q, i) => acc + (this.userAnswers[i] === q.answer ? 1 : 0), 0);
  }
}
