import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = true;
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  filename: string;
  imagePreview = null;
  constructor(public postService: PostsService, public route: ActivatedRoute) { }
  // private _snackBar: MatSnackBar

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.filename = file.name;
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(formDirective: FormGroupDirective) {
    if(this.mode === true) {
      this.postService.addPost(this.form.value.title, this.form.value.body, this.form.value.image);
    }
    else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.body, this.form.value.image);
    }
    formDirective.resetForm();
    this.form.reset();
  }
  
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      body: new FormControl(null, Validators.required)
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = false;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, body: postData.body, imagePath: postData.imagePath };
          this.form.setValue({ title: this.post.title, image: this.post.imagePath, body: this.post.body });
        });
      }
      else {
        this.mode = true;
        this.postId = null;
      }
    });
  }

}
