import styled, { keyframes } from 'styled-components';

export const LoadingContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
    height: 100%;
    z-index: 2000;
    display: none;
`;

const spin = keyframes`
  to {transform: rotate(360deg);}
`;

export const Loader = styled.span`
    width: 32px;
    height: 32px;
    &:before {
        content: '';
        box-sizing: border-box;
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        margin-left: -8px;
        border-radius: 50%;
        border: 2px solid #004dff;
        border-top-color: transparent;
        border-right-color: #004dff;
        border-bottom-color: transparent;
        animation: ${spin} 2s linear infinite;
    }
`;

const Spinner = () => (
    <LoadingContainer id="loader">
        <Loader />
    </LoadingContainer>
);

export default Spinner;
