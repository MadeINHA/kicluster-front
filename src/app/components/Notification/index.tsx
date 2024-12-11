import styled from 'styled-components/macro';

const Root = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  position: absolute;
  top: calc(env(safe-area-inset-top) + 16px);
  width: calc(100% - 2 * 16px);
  padding: 16px 32px;
  background-color: #ffc0c0;
  border-radius: 16px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.16);
  transition: top 0.2s;
  z-index: 2;
`;

export default function Notification({
  onClick,
  isVisible,
  message,
}: {
  onClick: () => void;
  isVisible: boolean;
  message: string;
}) {
  return (
    <Root onClick={onClick} style={{ top: isVisible ? undefined : '-100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: '4px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#12052e"
        >
          <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
        </svg>
        <div>{message}</div>
      </div>
    </Root>
  );
}
