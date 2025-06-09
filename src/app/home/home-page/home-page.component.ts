import { Component } from '@angular/core';
import { GeminiService } from '../../core/service/gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  dailyWords: string[] = [];
  selectedWord: string | null = null;
  wordDetail: { meaning: string, examples: { english: string, vietnamese: string }[] } | null = null;
  loading = false;
  error: string = '';

  dailyQuote: string = '';

  levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'elementary', label: 'Elementary' },
    { value: 'pre-intermediate', label: 'Pre-Intermediate' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'upper-intermediate', label: 'Upper-Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];
  topics = [
    'Family', 'Travel', 'Work', 'Education', 'Health', 'Technology', 'Food', 'Environment', 'Sports', 'Culture'
  ];
  selectedLevel = this.levels[4].value;
  selectedTopic = this.topics[3];
  searchedWords: string[] = [];
  searchLoading = false;
  searchError = '';

  constructor(private geminiService: GeminiService
  ) {
  }
  ngOnInit(): void {
    // this.getWords();
    // this.getQuotation();
  }

  searchVocab() {
    this.getWords();
    this.getQuotation();
  }

  getWords() {
    const prompt = `Hãy cung cấp 10 từ tiếng Anh ${this.selectedLevel} về chủ đề "${this.selectedTopic}", mỗi từ trên một dòng. Chỉ trả về danh sách các từ, không giải thích.`;
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        this.dailyWords = text.split('\n').map((word: string) => word.trim()).filter((word: any) => word);
        this.selectedWord = null;
        this.wordDetail = null;
        this.error = '';
        this.selectWord(this.dailyWords[0]); // Tự động chọn từ đầu tiên
      },
      error: (err) => {
        this.error = 'Lỗi: ' + (err?.error?.error?.message || err.message || 'Không xác định');
      }
    });

  }

  selectWord(word: string) {
    this.selectedWord = word;
    this.wordDetail = null;
    this.error = '';
    this.loading = true;
    const prompt = `Hãy cho biết nghĩa tiếng Việt của từ "${word}" và 2 câu ví dụ sử dụng từ đó trong tiếng Anh (có dịch nghĩa tiếng Việt cho mỗi câu). Trả về kết quả dạng JSON với 2 trường: meaning (nghĩa tiếng Việt), examples (mảng các câu ví dụ, mỗi câu gồm tiếng Anh và tiếng Việt).`;
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        try {
          // Tìm đoạn JSON trong kết quả trả về
          const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            const data = JSON.parse(match[0]);
            this.wordDetail = {
              meaning: data.meaning,
              examples: Array.isArray(data.examples) ? data.examples : []
            };
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

  getQuotation() {

    const prompt = `Hãy cho một đoạn văn từ 7-10 câu tiếng Anh ${this.selectedLevel} về chủ đề "${this.selectedTopic}". `;
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        try {
          // Tìm đoạn JSON trong kết quả trả về
          this.dailyQuote = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
}
