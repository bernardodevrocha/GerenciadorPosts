CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  url VARCHAR(512) NOT NULL,
  CONSTRAINT fk_photos_posts
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
);

INSERT INTO posts (title, body) VALUES
  ('Post 1', 'Lorem ipsum 1'),
  ('Post 2', 'Lorem ipsum 2'),
  ('Post 3', 'Lorem ipsum 3'),
  ('Post 4', 'Lorem ipsum 4'),
  ('Post 5', 'Lorem ipsum 5');

INSERT INTO photos (post_id, url) VALUES
  (1, 'https://picsum.photos/id/101/600/400'),
  (2, 'https://picsum.photos/id/102/600/400'),
  (3, 'https://picsum.photos/id/103/600/400'),
  (4, 'https://picsum.photos/id/104/600/400'),
  (5, 'https://picsum.photos/id/105/600/400');
