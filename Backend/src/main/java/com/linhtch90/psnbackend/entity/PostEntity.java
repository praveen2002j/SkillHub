package com.linhtch90.psnbackend.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post")
public class PostEntity {
    @Id
    private String id;

    private String userId;

    private String originalUserId;

    private String content;

    private String image;

    private String postType;

    private Instant createdAt;

    private List<String> savedBy = new ArrayList<>();

    List<String> love = new ArrayList<>();

    List<String> images = new ArrayList<>();

    List<String> share = new ArrayList<>();

    List<CommentEntity> comment = new ArrayList<>();

    public void setCreatedAt(Instant now) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Object getContent() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setContent(Object content2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setContent'");
    }

    public Object getImages() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setImages(Object images2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setImages'");
    }

    public String getId() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Object getCreatedAt() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
