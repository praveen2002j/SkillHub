package com.linhtch90.psnbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// @AllArgsConstructor annotation removed to avoid duplicate constructor
public class PostByFollowing {
    private UserEntity user;
    private PostEntity post;

    public PostByFollowing(UserEntity followingUser, PostEntity item) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Object getPost() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
