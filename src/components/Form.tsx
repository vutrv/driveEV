import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  Box, Button, Stack, Grid, Card, CardContent, CardActions, Typography, 
  FormControl, Select, MenuItem, FormGroup, FormControlLabel, Switch
} from '@mui/material';
import { CustomTextField, CustomFormLabel } from './TextField';
import { CustomCheckbox } from './Checkbox';
import { 
  NewElectricVehicleRebate, 
  UsedElectricVehicleRebate, 
  DrivePlusRebate 
} from '../service'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const periodOptions = [
  { value: '12 months', label: '12 months' },
  { value: '03 months', label: '03 months' },
  { value: '01 months', label: '01 months' },
];

const dealershipOpions = [
  {value: 1, label: 'Volkswagen of North Attleboro'},
  {value: 2, label: 'Boch Nissan South'},
  {value: 3, label: 'Patriot Subaru of North Attleboro'},
  {value: 4, label: 'Kia of Attleboro'},
  {value: 5, label: 'Stateline Subaru'},
  {value: 6, label: 'Courtesy Mitsubishi'},
  {value: 7, label: 'Milford Nissan'},
  {value: 8, label: 'Bob Valenti Chevrolet'},
  {value: 9, label: 'Copeland Chevrolet'},
  {value: 10, label: 'McGovern Hyundai'},
  {value: 11, label: 'McGovern Chevrolet'},
  {value: 12, label: 'Imperial Ford'},
  {value: 13, label: 'Putnam Kia'},
  {value: 14, label: 'Marlboro Nissan'},
  {value: 15, label: '1A Auto Sales'},
  {value: 15, label: 'Bristol Toyota'},  
];

const USStates = [
  { value: 1, label: 'Alabama' },
  { value: 2, label: 'Alaska' },
  { value: 3, label: 'Arizona' },
  { value: 4, label: 'Arkansas' },
  { value: 5, label: 'California' },
  { value: 6, label: 'Colorado' },
  { value: 7, label: 'Connecticut' },
  { value: 8, label: 'Delaware' },
  { value: 9, label: 'Florida' },
  { value: 10, label: 'Georgia' },
  { value: 11, label: 'Hawaii' },
  { value: 12, label: 'Idaho' },
  { value: 13, label: 'Illinois' },
  { value: 14, label: 'Indiana' },
  { value: 15, label: 'Iowa' },
  { value: 16, label: 'Kansas' },
  { value: 17, label: 'Kentucky' },
  { value: 18, label: 'Louisiana' },
  { value: 19, label: 'Maine' },
  { value: 20, label: 'Maryland' },
  { value: 21, label: 'Massachusetts' },
  { value: 22, label: 'Michigan' },
  { value: 23, label: 'Minnesota' },
  { value: 24, label: 'Mississippi' },
  { value: 25, label: 'Missouri' },
  { value: 26, label: 'Montana' },
  { value: 27, label: 'Nebraska' },
  { value: 28, label: 'Nevada' },
  { value: 29, label: 'New Hampshire' },
  { value: 30, label: 'New Jersey' },
  { value: 31, label: 'New Mexico' },
  { value: 32, label: 'New York' },
  { value: 33, label: 'North Carolina' },
  { value: 34, label: 'North Dakota' },
  { value: 35, label: 'Ohio' },
  { value: 36, label: 'Oklahoma' },
  { value: 37, label: 'Oregon' },
  { value: 38, label: 'Pennsylvania' },
  { value: 39, label: 'Rhode Island' },
  { value: 40, label: 'South Carolina' },
  { value: 41, label: 'South Dakota' },
  { value: 42, label: 'Tennessee' },
  { value: 43, label: 'Texas' },
  { value: 44, label: 'Utah' },
  { value: 45, label: 'Vermont' },
  { value: 46, label: 'Virginia' },
  { value: 47, label: 'Washington' },
  { value: 48, label: 'West Virginia' },
  { value: 49, label: 'Wisconsin' },
  { value: 50, label: 'Wyoming' },
  { value: 51, label: 'District of Columbia' },
];

const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Firstname is Required'),
  lastName: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Lastname is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  city: yup
    .string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('City is Required'),
  selectedState: yup.string().required('Please select a state'),
  zipCode: yup.number()
  .required('Zipcode is required')
  .typeError('Please enter a number')
  .positive('Must be a positive number.'),
  driverLicense: yup
    .string()
    .max(50, 'Too Long!')
    .required('Driver license number is Required'),
  selectedDealership: yup.string().required('Please select a dealership'),
  selectedDate: yup.date().required('Date is required'),
  householdSize: yup.string().when('isDriverPlusEnable', {
    is: true,
    then: yup.number()
    .required('Householde size is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }), 
  selectedPeriod: yup.string().when('isDriverPlusEnable', {
    is: true,
    then: yup.string().required('Please select a period')
  }),
  income: yup.string().when('isDriverPlusEnable', {
    is: true,
    then: yup.number()
    .required('Zipcode is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }), 
});

const Form = () => {
  const [isLeaseSelected, setIsLeaseSelected] = useState(false);

  const handleSwitchChange = () => {
    setIsLeaseSelected((prevIsLeaseSelected) => !prevIsLeaseSelected);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      city:'',
      phoneNumber: '',
      selectedState: '',
      zipCode: '',
      driverLicense: '',
      isDrivePlusEnable: false,
      selectedDate: '',
      selectedDealership: '',
      householdSize: '',
      selectedPeriod: '',
      income: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (formValues: any) => {
    console.log({formValues}); // Check the value in console
    // Case for DriveEV
    if (!isLeaseSelected) {
      new NewElectricVehicleRebate(formValues.selectedDate);
    } else {
      new UsedElectricVehicleRebate(formValues.selectedDate);
    }
    // If customer added drive Plus
    if (formValues.isDrivePlusEnable) {
      new DrivePlusRebate(formValues.selectedDate, 4);
    }
  }
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid item xs={12} sm={6} sx={{padding: 5}}>
          <Card sx={{minWidth: 275, maxWidth: 500, margin: 'auto'}}>
            <CardContent>
              <Typography sx={{ fontSize: 24, fontWeight: 'bold', color: 'red', textAlign: 'center' }} color="text.primary" gutterBottom>
                Drive EV Form
              </Typography>
              <Stack>
                <Box>
                  <CustomFormLabel>First Name</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>Last Name</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>Email</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>Password</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>Phone Number</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>City</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Box>
                <FormControl fullWidth>
                  <CustomFormLabel>State</CustomFormLabel>
                  <Select
                    id="selectedState"
                    name="selectedState"
                    value={formik.values.selectedState}
                    onChange={formik.handleChange}
                    error={formik.touched.selectedState && Boolean(formik.errors.selectedState)}
                  >
                    {USStates.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.selectedState && formik.errors.selectedState ? (
                    <p style={{ 
                      color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                    }}>{formik.errors.selectedState}</p>
                  ) : null}
                </FormControl>
                <Box>
                  <CustomFormLabel>Zip Code</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="zipCode"
                    name="zipCode"
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                  />
                </Box>
                <Box>
                  <CustomFormLabel>Driver's License Number</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="driverLicense"
                    name="driverLicense"
                    value={formik.values.driverLicense}
                    onChange={formik.handleChange}
                    error={formik.touched.driverLicense && Boolean(formik.errors.driverLicense)}
                    helperText={formik.touched.driverLicense && formik.errors.driverLicense}
                  />
                </Box>
                <FormControl fullWidth>
                  <CustomFormLabel>Dealership</CustomFormLabel>
                  <Select
                    id="selectedDealership"
                    name="selectedDealership"
                    value={formik.values.selectedDealership}
                    onChange={formik.handleChange}
                    error={formik.touched.selectedDealership && Boolean(formik.errors.selectedDealership)}
                  >
                    {dealershipOpions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.selectedDealership && formik.errors.selectedDealership ? (
                    <p style={{ 
                      color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                    }}>{formik.errors.selectedDealership}</p>
                  ) : null}
                </FormControl>
              </Stack>
              <br />
              <span>Purchase</span>
              <FormControlLabel
                control={
                  <Switch
                    checked={isLeaseSelected}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                labelPlacement="start"
                label={''}
                style={{marginRight: '2px', marginLeft: '2px'}}
              />
              <span>Lease</span>
              <br />
              <div>
                <label style={{marginRight: '20px'}} htmlFor="selectedDate">Select purchase or lease date:</label>
                <input
                  type="date"
                  id="selectedDate"
                  name="selectedDate"
                  value={formik.values.selectedDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.selectedDate && formik.errors.selectedDate ? (
                  <p style={{ 
                    color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                    marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                  }}>{formik.errors.selectedDate}</p>
                ) : null}
              </div>
              <br />
              <Stack justifyContent="space-between" direction="row" alignItems="center" mb={2}>
                <FormGroup>
                  <FormControlLabel
                    id="isDrivePlusEnable"
                    name="isDrivePlusEnable"
                    control={<CustomCheckbox checked={formik.values.isDrivePlusEnable} 
                    onChange={formik.handleChange}
                    />}
                    label="DRIVE+ provides up to $1,500 discount"
                  />
                </FormGroup>
              </Stack>
              {
                formik.values.isDrivePlusEnable && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box>
                        <CustomFormLabel>Householde Size</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            id="householdSize"
                            name="householdSize"
                            type="number"
                            value={formik.values.householdSize}
                            onChange={formik.handleChange}
                            error={formik.touched.householdSize && Boolean(formik.errors.householdSize)}
                            helperText={formik.touched.householdSize && formik.errors.householdSize}
                          />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <CustomFormLabel>Period (months)</CustomFormLabel>
                        <Select
                          id="selectedPeriod"
                          name="selectedPeriod"
                          value={formik.values.selectedPeriod}
                          onChange={formik.handleChange}
                          error={formik.touched.selectedPeriod && Boolean(formik.errors.selectedPeriod)}
                        >
                          {periodOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.selectedPeriod && formik.errors.selectedPeriod ? (
                          <p style={{ 
                            color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                            marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                          }}>{formik.errors.selectedPeriod}</p>
                        ) : null}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <CustomFormLabel>Income ($)</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            id="income"
                            name="income"
                            type="number"
                            value={formik.values.income}
                            onChange={formik.handleChange}
                            error={formik.touched.income && Boolean(formik.errors.income)}
                            helperText={formik.touched.income && formik.errors.income}
                          />
                      </Box>
                    </Grid>
              </Grid>
                )
              }
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'flex-end', padding: '16px'}}>
              <Button color="primary" variant="contained" type="submit">
                Submit
              </Button>
            </CardActions>
          </Card>
        </Grid>
    </form>
  );
};

export default Form;
