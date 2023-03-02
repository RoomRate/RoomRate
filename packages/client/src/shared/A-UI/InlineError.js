import React from 'react';
import styled from '@emotion/styled';

const StyledInlineError = styled.span`/* stylelint-disable-line */
  color: red;
  &:before {
    display: inline-block;
    content: "⚠️ ";
  }
`;

export const InlineError = ({ errors, message, name }) => {
  while (name.includes(`.`)) {
    const tempName = name.substring(0, name.indexOf(`.`));
    errors = errors[tempName];
    name = name.substring(name.indexOf(`.`) + 1);
  }

  return errors[name] ?
    <div>
      <StyledInlineError>
        {errors[name].message || message}
      </StyledInlineError>
    </div> :
    null; // NOTE: Don't change ternary to &&
};