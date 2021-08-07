import DateFnsUtils from '@date-io/date-fns';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

export type CustomFormControlProps = {
  id?: string;
  name?: string;
  /**
   * This will create a dropdown
   */
  enumType?: { [key: string]: string | number };
  label?: string;
  /**
   * Important if the input is of type options
   */
  helperText?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  title?: string;
  ariaDescribe?: string;
  datePicker?: boolean;
  handleDateChange?: (date: Date | null) => void;
  initialDate?: Date;
  value?: string;
};

const CustomFormControl: React.FC<CustomFormControlProps> = (props) => {
  const {
    id,
    name,
    onChangeHandler,
    enumType,
    label,
    helperText,
    autoComplete,
    title,
    ariaDescribe,
    datePicker,
    initialDate,
    handleDateChange,
    value,
  } = props;

  if (datePicker) {
    if (handleDateChange) {
      return (
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="normal"
              label="Release Date"
              value={initialDate ?? new Date()}
              onChange={handleDateChange}
              autoOk
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      );
    } else {
      return <div>Please provide handleDateChange</div>;
    }
  }

  if (enumType) {
    return (
      <FormControl fullWidth>
        <TextField
          name={name}
          select
          label={label}
          value={value}
          onChange={onChangeHandler}
          SelectProps={{
            native: true,
          }}
          helperText={helperText}
        >
          {Object.keys(enumType).map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>{title}</InputLabel>
      <Input
        name={name}
        id={id}
        aria-describedby={ariaDescribe}
        onChange={onChangeHandler}
        autoComplete={autoComplete}
        value={value}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default CustomFormControl;
