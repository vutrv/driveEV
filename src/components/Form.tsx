import { useState, useRef, useEffect } from 'react';
import Select  from 'react-select'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  Box, Button, Stack, Grid, Card, CardContent, CardActions, Typography, 
  FormControl, Select as MSelect, MenuItem, FormGroup, FormControlLabel, Switch
} from '@mui/material';
import { CustomTextField, CustomFormLabel } from './TextField';
import { CustomCheckbox } from './Checkbox';
import { DriveEVService, DriverEVPlusService } from '../service'
import { 
  auto_ri_address, auto_out_of_state_address, houseHoldSizes, periodOptions,
  EVProgramState, evTypes, RhodeIslandCities, ProgramType
 } from '../constant';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

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
  address: yup.string().required('Address is required'),
  zipCode: yup.number()
  .required('Zipcode is required')
  .typeError('Please enter a number')
  .positive('Must be a positive number.'),
  driverLicense: yup
    .string()
    .max(50, 'Too Long!')
    .required('Driver license number is Required'),
  leaseDuration: yup.number().nullable().when('isLease', {
    is: true,
    then: yup.number()
    .required('Lease duration size is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }), 
  dealerShipType: yup.string().required('evType is required'),
  selectedDealership: yup.string().required('Please select a dealership'),
  selectedDate: yup.date().required('Date is required'),
  evType: yup.string().required('evType is required'),
  householdSize: yup.number().when('isDrivePlusEnable', {
    is: true,
    then: yup.number()
    .required('Householde size is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }), 
  selectedPeriod: yup.number().when('isDrivePlusEnable', {
    is: true,
    then: yup.number()
    .required('Period is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }),
  income: yup.number().when('isDrivePlusEnable', {
    is: true,
    then: yup.number()
    .required('Income is required')
    .typeError('Please enter a number')
    .positive('Must be a positive number.')
  }), 
});

const Form = () => {
  const [isLeaseSelected, setIsLeaseSelected] = useState(false);
  const [dealerShip, setDealership] = useState('RI');
  const [dealerShipAddresses, setDealerShipAddress] = useState(auto_ri_address);
  const [selectedAddress, setSelectedAddress] = useState({value: '', label: ''});
  const selectedRef = useRef<any>();
  const [submitResponse, setSubmitResponse] = useState<any>(null);

  const handleSwitchChange = () => {
    formik.setFieldValue('isLease', !isLeaseSelected);
    setIsLeaseSelected((prevIsLeaseSelected) => !prevIsLeaseSelected);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      city:'',
      address: '',
      phoneNumber: '',
      selectedState: '',
      zipCode: '',
      driverLicense: '',
      evType: '',
      isLease: false,
      leaseDuration: '',
      isDrivePlusEnable: false,
      selectedDate: '',
      selectedDealership: '',
      householdSize: '',
      selectedPeriod: '',
      income: '',
      dealerShipType: 'RI',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (formValues: any) => {
    if (!formValues.isDrivePlusEnable) {
      DriverEVProcess(formValues);
    } else {
      DriverEVPlusProcess(formValues);
    }
  }

  const DriverEVProcess = (formValues: any) => {
    const driverEVService = new DriveEVService(
      formValues.selectedDate,
      formValues.dealerShipType,
      formValues.driverLicense,
      formValues.selectedDealership,
      formValues.isLease ? ProgramType.Lease : ProgramType.Purchase,
      formValues.evType,
      formValues.leaseDuration === '' ? null : formValues.leaseDuration
    );
    
    const response = driverEVService.getRebateAmount();
    setSubmitResponse(response);
    return response;
  }

  const DriverEVPlusProcess = (formValues: any) => {
    const driverEVService = new DriverEVPlusService(
      formValues.selectedDate,
      formValues.dealerShipType,
      formValues.driverLicense,
      formValues.selectedDealership,
      formValues.isLease ? ProgramType.Lease : ProgramType.Purchase,
      formValues.evType,
      formValues.householdSize,
      formValues.selectedPeriod,
      formValues.income,
      formValues.leaseDuration === '' ? null : formValues.leaseDuration
    );
    
    const response = driverEVService.getTotalRebateAmount();
    setSubmitResponse(response)
    return response;
  }

  const handleChangeDealerShipType = (event: any) => {
    formik.setFieldValue('dealerShipType', event.target.value);
    formik.setFieldValue('selectedDealership', '');
    setDealership(event.target.value);
    setSelectedAddress({value: '', label: ''});
    if (event.target.value !== dealerShip) {
      if (event.target.value === 'RI') {
        setDealerShipAddress(auto_ri_address);
      } else setDealerShipAddress(auto_out_of_state_address);
    }
  }

  const handleChangeAddress = (event: any) => {
    formik.setFieldValue('selectedDealership', event.label);
  }

  const handleChangeEvType = (event: any) => {
    formik.setFieldValue('evType', event.label);
  }

  const handleChangeState = (event: any) => {
    formik.setFieldValue('selectedState', event.label);
  }

  const handleChangeCity = (event: any) => {
    formik.setFieldValue('city', event.label);
  }

  const handleChangeHouseholdSize = (event: any) => {
    formik.setFieldValue('householdSize', event.label);
  }

  const handleChangePeriod = (event: any) => {
    formik.setFieldValue('selectedPeriod', event.label);
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>First Name:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel style={{marginBottom: '3px'}}>Last Name:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Email:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Password:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Phone Number:</CustomFormLabel>
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
                <FormControl fullWidth sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>State:</CustomFormLabel>
                  <Select options={EVProgramState} onChange = {handleChangeState} />
                  {formik.touched.selectedState && formik.errors.selectedState ? (
                    <p style={{ 
                      color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                    }}>{formik.errors.selectedState}</p>
                  ) : null}
                </FormControl>
                <FormControl fullWidth sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>City: </CustomFormLabel>
                  <Select options={RhodeIslandCities} onChange = {handleChangeCity} />
                  {formik.touched.city && formik.errors.city ? (
                    <p style={{ 
                      color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                    }}>{formik.errors.city}</p>
                  ) : null}
                </FormControl>
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Street:</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Box>
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Zip Code:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Driver's License Number:</CustomFormLabel>
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
                <Box sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>Choose dealership:</CustomFormLabel>
                  <div>
                    <input
                      type="radio"
                      id="RI"
                      name="RI"
                      value="RI"
                      checked={dealerShip === 'RI'}
                      onChange={handleChangeDealerShipType}
                    />
                    <label style={{marginLeft: '5px'}} htmlFor="RI">Rhode Island</label>
                  </div>
                  <br />
                  <div>
                    <input
                      type="radio"
                      id="Out of state"
                      name="Out of state"
                      value="Out of state"
                      checked={dealerShip === 'Out of state'}
                      onChange={handleChangeDealerShipType}
                    />
                    <label style={{marginLeft: '5px'}} htmlFor="Out of state">Out of state</label>
                  </div>
                </Box>
                <FormControl fullWidth sx={{marginBottom: '15px'}}>
                  <CustomFormLabel>{dealerShip === 'RI' ?  'Rhode Island Dealership Address:' : 'Out-Of-State Dealership Address:'}</CustomFormLabel>
                  <Select options={dealerShipAddresses} onChange = {handleChangeAddress} />
                  {/* {formik.touched.selectedDealership && formik.errors.selectedDealership ? (
                    <p style={{ 
                      color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                    }}>{formik.errors.selectedDealership}</p>
                  ) : null} */}
                </FormControl>
              </Stack>
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
                <>
                {
                  isLeaseSelected && <Box>
                  <CustomFormLabel>Lease duration (month):</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    id="leaseDuration"
                    name="leaseDuration"
                    value={formik.values.leaseDuration}
                    onChange={formik.handleChange}
                    error={formik.touched.leaseDuration && Boolean(formik.errors.leaseDuration)}
                    helperText={formik.touched.leaseDuration && formik.errors.leaseDuration}
                  />
                  </Box>
                }
                </>
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
              <FormControl fullWidth>
                <CustomFormLabel>EV Type</CustomFormLabel>
                <Select options={evTypes} onChange = {handleChangeEvType} />
                {/* {formik.touched.selectedDealership && formik.errors.selectedDealership ? (
                  <p style={{ 
                    color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                    marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                  }}>{formik.errors.selectedDealership}</p>
                ) : null} */}
              </FormControl>
              <br />
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
                      <CustomFormLabel>Household Size:</CustomFormLabel>
                      <Select options={houseHoldSizes} onChange = {handleChangeHouseholdSize} />
                      {formik.touched.householdSize && formik.errors.householdSize ? (
                          <p style={{ 
                            color: '#d32f2f', fontWeight: 400, fontSize: '0.75rem', 
                            marginTop: '3px', marginLeft: '14px', marginRight: '14px', lineHeight: 1.66 
                          }}>{formik.errors.householdSize}</p>
                        ) : null}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <CustomFormLabel>Period (months):</CustomFormLabel>
                        <Select options={periodOptions} onChange = {handleChangePeriod} />
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
                        <CustomFormLabel>Income ($):</CustomFormLabel>
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
            <Grid item xs={12} sm={12}>
              <Box sx={{paddingLeft: '12px'}}>
              {submitResponse && submitResponse.status === 'error' ? (
                  submitResponse.errors.map((error: string) => (
                    <div key={error} style={{ 
                      color: '#d32f2f', fontWeight: 500, fontSize: '14px', 
                      marginTop: '3px', marginLeft: '14px', marginRight: '10px', lineHeight: 1.66 
                    }}>
                      <span >{`* ${error}`}</span>
                      {submitResponse?.linkProgram && <a target="_blank" href={submitResponse.linkProgram}>{`: ${submitResponse.linkProgram}`}</a>}
                    </div>
                    
                  )) 
                ) : null}
              </Box>
              <Box sx={{paddingLeft: '12px'}}>
              {submitResponse && submitResponse.status === 'success' ? (
                <span style={{ 
                  color: '#008000', fontWeight: 500, fontSize: '14px', 
                  lineHeight: 1.66, paddingLeft: '2px'
                }}> {`${submitResponse.message} The estimated discount amount is: ${submitResponse.discount} ${submitResponse.currency}`}
                </span>
                ) : null}
              </Box>
            </Grid>
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
