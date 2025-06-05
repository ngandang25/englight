import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { GeminiService } from '../../shared/service/gemini.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
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

  constructor(private geminiService: GeminiService) { }

  translate() {
    const word = this.form.value.input?.trim();
    const direction = this.form.value.direction;
    if (!word) return;
    this.loading = true;
    this.result = '';
    let prompt = '';
    if (direction === 'en-vi') {
      prompt = `Dịch từ tiếng Anh sang tiếng Việt: "${word}". Chỉ trả về nghĩa tiếng Việt, không giải thích.`;
    } else {
      prompt = `Dịch từ tiếng Việt sang tiếng Anh: "${word}". Chỉ trả về nghĩa tiếng Anh, không giải thích.`;
    }
    this.geminiService.generateContent(prompt).subscribe({
      next: (res) => {
        this.result = res?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có kết quả.';
        this.loading = false;
      },
      error: (err) => {
        this.result = 'Lỗi: ' + (err?.error?.error?.message || err.message || 'Không xác định');
        this.loading = false;
      }
    });
  }
}
