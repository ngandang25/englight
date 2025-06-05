import { Component } from '@angular/core';
import { GeminiService } from '../../shared/service/gemini.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
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
  quoteAuthor: string = '';

  constructor(private geminiService: GeminiService) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getWords();
    this.getDailyQuote();
  }

  getWords() {
    const prompt = 'Hãy cung cấp 10 từ tiếng Anh pre-intermediate level cho hôm nay, mỗi từ trên một dòng. Chỉ trả về danh sách các từ, không giải thích.';
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

  getDailyQuote() {
    // Danh sách các câu nói hay mẫu, có thể mở rộng hoặc lấy từ API nếu muốn
    const quotes = [
      { text: 'The best way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
      { text: 'Success is not in what you have, but who you are.', author: 'Bo Bennett' },
      { text: 'Opportunities don’t happen, you create them.', author: 'Chris Grosser' },
      { text: 'Don’t let yesterday take up too much of today.', author: 'Will Rogers' },
      { text: 'It’s not whether you get knocked down, it’s whether you get up.', author: 'Vince Lombardi' },
      { text: 'If you are working on something exciting, it will keep you motivated.', author: 'Steve Jobs' },
      { text: 'The harder you work for something, the greater you’ll feel when you achieve it.', author: 'Unknown' },
      { text: 'Dream bigger. Do bigger.', author: 'Unknown' },
      { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
      { text: 'Great things never come from comfort zones.', author: 'Unknown' }
    ];
    // Lấy quote theo ngày (mỗi ngày 1 câu, lặp lại sau 10 ngày)
    const dayIndex = (new Date().getDate() - 1) % quotes.length;
    this.dailyQuote = quotes[dayIndex].text;
    this.quoteAuthor = quotes[dayIndex].author;
  }
}
