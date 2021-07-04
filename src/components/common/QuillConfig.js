import styled from 'styled-components';

export const QuillConfig = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'header': 1 }, { 'header': 2 }, 'code-block'],
        [
            { 'list': 'ordered' },
            { 'list': 'bullet' },
            { 'indent': '-1' },
            { 'indent': '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        matchVisual: false,
    },
};

export const QuillContainer = styled.div`
    margin-top: 16px;
    margin-bottom: 8px;

    .ql-editor {
        min-height: 150px;
    }

    .ql-toolbar.ql-snow {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .ql-container.ql-snow {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`;
