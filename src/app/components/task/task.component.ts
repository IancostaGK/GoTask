import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TextComponent } from "../text/text.component";

@Component({
  selector: 'app-task',
  imports: [TextComponent, NgOptimizedImage],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

}
