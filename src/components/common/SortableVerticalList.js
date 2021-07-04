import { IconButton } from '@material-ui/core';
import { Clear, DragHandle } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const List = styled.div`
    width: 100%;
`;

const Item = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px;
    font-weight: bold;
    background-color: rgba(0, 77, 255, 0.1);
    margin-top: 16px;
    border-radius: 4px;
    box-sizing: border-box;

    > :first-child {
        margin-right: 8px;
    }
`;

const SortableVerticalList = ({ items, setItems, onRemove }) => {
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        setItems(reorder(items, result.source.index, result.destination.index));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <Item
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <DragHandle />
                                        <div style={{ flexGrow: 1 }}>
                                            {item.title}
                                        </div>
                                        {onRemove && (
                                            <IconButton
                                                color="secondary"
                                                onClick={() => onRemove(item)}
                                            >
                                                <Clear />
                                            </IconButton>
                                        )}
                                    </Item>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default SortableVerticalList;
