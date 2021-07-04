import {
    Avatar,
    Box,
    Button,
    IconButton,
    TextareaAutosize,
    Typography,
} from '@material-ui/core';
import { useEffect, useState, useContext } from 'react';
import { Comment } from '../../../api/service';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined } from '@material-ui/icons';
import moment from 'moment';
import AuthContext from '../../../store/auth-context';
import { ADMINISTRATOR_ROLES } from '../../../constants';

const CommentField = styled(TextareaAutosize)`
    border-radius: 4px;
    width: 100%;
    padding: 16px;
    font-size: 1rem;
    font-family: Roboto;
    outline-color: ${(props) => props.theme.palette.primary.main};
    box-sizing: border-box;
`;

const CommentContainer = styled.div`
    background-color: ${(props) => props.theme.palette.background.default};
    padding: 8px 12px;
    border-radius: 4px;
`;

const Comments = ({ postId, name, userId, setNumberOfComments }) => {
    const [comments, setComments] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        Comment.getComments(postId).then((data) => setComments(data));
    }, []);

    const handleAddComment = () => {
        Comment.add({
            content: newComment,
            postId: postId,
        }).then((commentId) => {
            setComments([
                ...comments,
                {
                    id: commentId,
                    content: newComment,
                    postId: postId,
                    username: name,
                    userCreatedId: userId,
                    dateCreated: new Date(),
                },
            ]);
            setNumberOfComments(comments.length + 1);
            setNewComment('');
        });
    };

    const handleEditComment = () => {
        Comment.update(editCommentId, {
            content: editCommentContent,
        }).then(() => {
            let commentsCopy = [...comments];
            let index = commentsCopy.findIndex((x) => x.id === editCommentId);
            commentsCopy[index].content = editCommentContent;
            setComments(commentsCopy);
            setEditCommentId(null);
            setEditCommentContent('');
        });
    };

    const handleDeleteComment = (id) => {
        Comment.delete(id).then(() => {
            let commentsCopy = [...comments];
            let index = commentsCopy.findIndex((x) => x.id === id);
            commentsCopy.splice(index, 1);
            setComments(commentsCopy);
            setNumberOfComments(commentsCopy.length);
        });
    };

    return (
        comments && (
            <>
                <Box mt={2} borderTop="1px solid lightgray">
                    {comments.map((comment, index) => (
                        <Box key={comment.id} mt={2} display="flex">
                            <Avatar>{comment.username[0]}</Avatar>
                            {editCommentId === comment.id ? (
                                <Box
                                    ml={1}
                                    display="flex"
                                    flexDirection="column"
                                    flexGrow={1}
                                >
                                    <CommentField
                                        placeholder="Enter comment..."
                                        value={editCommentContent}
                                        onChange={(event) =>
                                            setEditCommentContent(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleEditComment();
                                            }
                                        }}
                                    />
                                    <Box
                                        mt={1}
                                        display="flex"
                                        alignSelf="flex-end"
                                    >
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            style={{ marginRight: '8px' }}
                                            onClick={() => {
                                                setEditCommentId(null);
                                                setEditCommentContent('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleEditComment}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    ml={1}
                                >
                                    <Typography
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        {comment.username}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        {moment
                                            .utc(comment.dateCreated)
                                            .fromNow(true)}
                                    </Typography>
                                    <CommentContainer>
                                        {comment.content}
                                    </CommentContainer>
                                    {(userId === comment.userCreatedId ||
                                        authCtx.hasPermission(
                                            ADMINISTRATOR_ROLES
                                        )) && (
                                        <Box mt={1} display="flex">
                                            {userId ===
                                                comment.userCreatedId && (
                                                <IconButton
                                                    aria-label="edit"
                                                    size="small"
                                                    disableRipple
                                                    onClick={() => {
                                                        setEditCommentId(
                                                            comment.id
                                                        );
                                                        setEditCommentContent(
                                                            comment.content
                                                        );
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                disableRipple
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment.id
                                                    )
                                                }
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                <Box mt={2} display="flex" alignItems="flex-end">
                    <CommentField
                        placeholder="Enter comment..."
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddComment();
                            }
                        }}
                    />

                    <Button
                        variant="outlined"
                        size="large"
                        color="primary"
                        disabled={!newComment}
                        style={{ marginLeft: '16px' }}
                        onClick={handleAddComment}
                    >
                        post
                    </Button>
                </Box>
            </>
        )
    );
};

export default Comments;
