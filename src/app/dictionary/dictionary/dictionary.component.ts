import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { GeminiService } from '../../core/service/gemini.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, FormsModule],
  templateUrl: './dictionary.component.html',
  styleUrl: './dictionary.component.scss'
})
export class DictionaryComponent {
  form: FormGroup = new FormGroup({
    input: new FormControl(''),
    direction: new FormControl('en-vi'), // 'en-vi' or 'vi-en'
  });
  result: string = '';
  loading = false;
  resultObj: { meaning: string, type?: string, pronunciation?: string, examples?: { english: string, vietnamese: string }[] } | null = null;

  paragraphInput: string = '';
  paragraphDirection: string = 'en-vi';
  paragraphResult: string = '';
  paragraphLoading = false;
  paragraphError = '';

  constructor(private geminiService: GeminiService) { }

  translate() {
    this.resultObj = null;
    const word = this.form.value.input?.trim();
    const direction = this.form.value.direction;
    if (!word) return;
    this.loading = true;
    this.result = '';
    let prompt = '';
    if (direction === 'en-vi') {
      prompt = `Dịch từ tiếng Anh sang tiếng Việt: "${word}". Trả về kết quả dạng JSON với các trường: meaning (nghĩa tiếng Việt), type (từ loại), pronunciation (phiên âm IPA), examples (mảng 2 object gồm english: câu ví dụ tiếng Anh, vietnamese: dịch nghĩa tiếng Việt). Không giải thích thêm.`;
    } else {
      prompt = `Dịch từ tiếng Việt sang tiếng Anh: "${word}". Trả về kết quả dạng JSON với các trường: meaning (nghĩa tiếng Anh), type (từ loại), pronunciation (phiên âm IPA), examples (mảng 2 object gồm english: câu ví dụ tiếng Anh, vietnamese: dịch nghĩa tiếng Việt). Không giải thích thêm.`;
    }
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        try {
          const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            this.resultObj = JSON.parse(match[0]);
          } else {
            this.result = text;
          }
        } catch (e) {
          this.result = 'Lỗi xử lý dữ liệu.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.result = 'Lỗi: ' + (err?.error?.error?.message || err.message || 'Không xác định');
        this.loading = false;
      }
    });
  }

  translateParagraph() {
    if (!this.paragraphInput.trim()) return;
    this.paragraphLoading = true;
    this.paragraphResult = '';
    this.paragraphError = '';
    let prompt = '';
    if (this.paragraphDirection === 'en-vi') {
      prompt = `Dịch đoạn văn sau sang tiếng Việt, giữ nguyên ngữ cảnh và ý nghĩa: \n"""${this.paragraphInput}"""`;
    } else {
      prompt = `Dịch đoạn văn sau sang tiếng Anh, giữ nguyên ngữ cảnh và ý nghĩa: \n"""${this.paragraphInput}"""`;
    }
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        this.paragraphResult = res?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có kết quả.';
        this.paragraphLoading = false;
      },
      error: (err) => {
        this.paragraphError = 'Lỗi: ' + (err?.error?.error?.message || err.message || 'Không xác định');
        this.paragraphLoading = false;
      }
    });
  }
}
