import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../api/service';
import PostCard from '../components/client/posts/PostCard';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        Post.get(id).then((data) => setPost(data));
    }, []);

    const setLike = (_, liked) => {
        setPost({
            ...post,
            liked: liked,
            numberOfLikes: liked
                ? post.numberOfLikes + 1
                : post.numberOfLikes - 1,
        });
    };

    const setNumberOfComments = (num) => {
        setPost({ ...post, numberOfComments: num });
    };

    return (
        post && (
            <Container maxWidth="sm">
                <PostCard
                    {...post}
                    includeComments
                    setLike={setLike}
                    setNumberOfComments={setNumberOfComments}
                />
            </Container>
        )
    );
};

export default PostPage;
