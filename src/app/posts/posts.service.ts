import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
// import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PostsService {
  
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams).
    pipe(map(postData => {
      return { posts: postData.posts.map(post => {
        // Passing values from database to model
        return {
          id: post._id,
          title: post.title,
          body: post.body,
          imagePath: post.imagePath
        };
      }),
      maxPosts: postData.maxPosts
    };
    })).
    subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
  }

  addPost(title: string, body: string, image: File) {
    // const post: Post = { id: null, title: title, body: body };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('body', body);
    postData.append('image', image, title);
    console.log(postData);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe(responseData => {
      alert('Post added successfully');
      this.router.navigate(['/create']);
    });
  }

  updatePost(id: string, title: string, body: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('body', body);
      postData.append('image', image, title);
    }
    else {
      postData = {
        id: id,
        title: title,
        body: body,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(response => {
      this.router.navigate(['/']);
      alert('Post updated successfully');
    });
  }

  deletePost(postId: string) {
    alert('Post deleted successfully');
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, body: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }
}
