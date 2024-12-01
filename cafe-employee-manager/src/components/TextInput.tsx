import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

type CustomTextFieldProps = TextFieldProps & {
  minLength?: number
  maxLength?: number
}

export const TextInput: React.FC<CustomTextFieldProps> = ({
  minLength,
  maxLength,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      inputProps={{
        minLength,
        maxLength,
        ...props.inputProps, // Merge additional inputProps
      }}
      {...props}
    />
  )
}
