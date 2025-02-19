import { useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';

/**
 * Styled component to visually hide content while keeping it accessible to screen readers.
 * This technique follows accessibility (a11y) best practices.
 *
 * Applied styles:
 * - Keeps text in document flow for screen readers
 * - Hides text visually without using display: none or visibility: hidden
 * - Ensures text doesn't interfere with layout
 * - Maintains text focusability for keyboard navigation
 */
const VisuallyHidden = styled('span')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap'
});

/**
 * Component that indicates a form field is required in an accessible way.
 *
 * How it works:
 * 1. Displays an asterisk (*) visually for sighted users
 * 2. Hides the asterisk from screen readers using aria-hidden="true"
 * 3. Provides explanatory text for screen readers via VisuallyHidden
 *
 * Usage:
 * ```tsx
 * <label>
 *   Name <RequiredFieldIndicator />
 * </label>
 * ```
 *
 * Result:
 * - Visual: "Name *"
 * - Screen reader: "Name This field is required"
 *
 * The message is internationalized using the 'auth.input.required_field_description' translation key
 */
const RequiredFieldIndicator = () => {
  const translate = useTranslate();

  return (
    <>
      <span aria-hidden="true">*</span>
      <VisuallyHidden>{translate('auth.input.required_field_description')}</VisuallyHidden>
    </>
  );
};

export default RequiredFieldIndicator;
