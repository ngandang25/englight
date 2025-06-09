import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { GeminiService } from '../../core/service/gemini.service';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatRadioModule],
  providers: [GeminiService],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent implements OnInit {
  tenses: string[] = [
    'Present Simple',
    'Present Continuous',
    'Present Perfect',
    'Present Perfect Continuous',
    'Past Simple',
    'Past Continuous',
    'Past Perfect',
    'Past Perfect Continuous',
    'Future Simple',
    'Future Continuous',
    'Future Perfect',
    'Future Perfect Continuous'
  ];
  grammarForm: FormGroup;
  details: WritableSignal<string> = signal<string>('');
  loading: WritableSignal<boolean> = signal<boolean>(false);
  error: WritableSignal<string> = signal<string>('');

  constructor(private fb: FormBuilder, private geminiService: GeminiService) {
    this.grammarForm = this.fb.group({
      isCustomTopic: [false],
      tense: [this.tenses[0]],
      customTopic: ['']
    });
  }
  ngOnInit(): void {
    // this.search();
  }

  search() {
    const { isCustomTopic, tense, customTopic } = this.grammarForm.value;
    let prompt = '';
    this.details.set('');
    this.error.set('');
    if (isCustomTopic && customTopic?.trim()) {
      prompt = `Giải thích chi tiết về chủ đề ngữ pháp tiếng Anh: '${customTopic}'. Bao gồm định nghĩa, cấu trúc, ví dụ minh họa và lưu ý khi sử dụng.`;
    } else if (!isCustomTopic && tense) {
      prompt = `Giải thích chi tiết về thì '${tense}' trong tiếng Anh. Bao gồm cấu trúc, cách dùng, ví dụ minh họa và lưu ý khi sử dụng.`;
    } else {
      return;
    }
    this.loading.set(true);
    this.geminiService.generateContent(prompt).subscribe({
      next: (res: any) => {
        let text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Xử lý định dạng: loại bỏ ký tự JSON, xuống dòng thành <br>, giữ lại đoạn văn
        try {
          // Nếu response là JSON, parse và render lại
          if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            const obj = JSON.parse(text);
            text = '<pre>' + JSON.stringify(obj, null, 2) + '</pre>';
          } else {
            // Thay \n hoặc \r\n thành <br>
            text = text.replace(/\n/g, '<br>');
          }
        } catch {
          text = text.replace(/\n/g, '<br>');
        }
        this.details.set(text);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Đã xảy ra lỗi khi lấy dữ liệu.');
        this.loading.set(false);
      }
    });
  }
}
