import {
    Box,
    Button,
    CircularProgress,
    Container,
    useMediaQuery,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Post } from '../../../api/service';
import PostCard from './PostCard';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const notMobile = useMediaQuery('(min-width:768px)');

    const loadPosts = () => {
        setLoading(true);
        Post.getPosts({ pageNumber: pageNumber + 1 }).then((data) => {
            setPosts([...posts, ...data.items]);
            setPageNumber(data.pageIndex);
            setHasNext(data.hasNextPage);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const setLike = (id, liked) => {
        let postsCopy = [...posts];

        let index = postsCopy.findIndex((x) => x.id === id);
        postsCopy[index].liked = liked;
        if (liked) {
            postsCopy[index].numberOfLikes++;
        } else {
            postsCopy[index].numberOfLikes--;
        }
        setPosts(postsCopy);
    };

    return (
        <Container maxWidth="sm">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    {...post}
                    notMobile={notMobile}
                    setLike={setLike}
                />
            ))}
            <Box textAlign="center" mt={2}>
                {loading && <CircularProgress />}
                {!loading && hasNext && (
                    <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={loadPosts}
                    >
                        Load more
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default Posts;
