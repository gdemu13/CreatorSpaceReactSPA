import { Grid, IconButton } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const StyledImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
`;

const SortableImages = ({ images, setImages, onRemove }) => {
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        setImages(
            reorder(images, result.source.index, result.destination.index)
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <Grid
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        container
                        spacing={2}
                    >
                        {images.map((item, index) => (
                            <Draggable
                                key={index}
                                draggableId={index.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={2}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <IconButton
                                                aria-label="delete"
                                                color="secondary"
                                                style={{
                                                    position: 'absolute',
                                                    padding: 0,
                                                    top: '5px',
                                                    right: '5px',
                                                }}
                                                onClick={() => onRemove(index)}
                                            >
                                                <HighlightOff />
                                            </IconButton>
                                            <StyledImg src={item.url} alt="" />
                                        </div>
                                    </Grid>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Grid>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default SortableImages;
