import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { GetLeadFieldsUpdatable, UpdateLead } from '../../../services/LeadsServices';
import { Countries } from '../../../utils/countries';
import { States } from '../../../utils/states';
import { Cities } from '../../../utils/cities';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import { UserContext } from '../../../contexts/userContext';
import { ILead, ILeadUpdatableField } from '../../../types/crm.types';
import { IUser } from '../../../types/user.types';
import AlertBar from '../../snacks/AlertBar';
import { toTitleCase } from '../../../utils/TitleCase';

export type TformData = {
  name: string,
  customer_name: string,
  customer_designation: string,
  mobile: string,
  email: string
  city: string,
  state: string,
  country: string,
  address: string,
  remark: string,
  work_description: string,
  turnover: string,
  lead_type: string,
  stage: string,
  alternate_mobile1: string,
  alternate_mobile2: string,
  alternate_email: string,
  lead_owners?: string[],
  lead_source: string,
  is_customer: boolean,
  visiting_card: string | Blob | File
}
function UpdateLeadForm({ lead, users }: { lead: ILead, users: IUser[] }) {
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<ILead>, BackendError, { id: string, body: FormData }>
    (UpdateLead, {
      onSuccess: () => {
        queryClient.invalidateQueries('leads')
        queryClient.invalidateQueries('customers')
        queryClient.invalidateQueries('uselessleads')
      }
    })
  const { user } = useContext(UserContext)
  const { data, isSuccess: isFieldsSuccess } = useQuery<AxiosResponse<ILeadUpdatableField>, BackendError>("updateble-lead-leads", GetLeadFieldsUpdatable)
  const [fields, setFields] = useState<ILeadUpdatableField>()

  const { setChoice } = useContext(ChoiceContext)
  const formik = useFormik<TformData>({
    initialValues: {
      name: lead.name,
      customer_name: lead.customer_name || "",
      customer_designation: lead.customer_designation || "",
      mobile: lead.mobile || "",
      email: lead.email || "",
      city: lead.city && toTitleCase(lead.city) || "",
      state: lead.state || "",
      remark: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || "",
      country: lead.country || "",
      address: lead.address || "",
      work_description: lead.work_description || "",
      turnover: lead.turnover || "",
      lead_type: lead.lead_type || "",
      stage: lead.stage || "",
      alternate_mobile1: lead.alternate_mobile1 || "",
      alternate_mobile2: lead.alternate_mobile2 || "",
      alternate_email: lead.alternate_email || "",
      lead_source: lead.lead_source || "",
      lead_owners: lead.lead_owners.map((owner) => {
        return owner._id
      }),
      is_customer: lead.is_customer,
      visiting_card: lead.visiting_card && lead.visiting_card.public_url || ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
      ,
      lead_owners: Yup.array()
        .required('Required field'),
      email: Yup.string()
        .email('provide a valid email id'),
      alternate_email: Yup.string()
        .email('provide a valid email id'),
      customer_name: Yup.string()
      ,
      customer_designation: Yup.string(),
      city: Yup.string()
      ,
      state: Yup.string()
      ,
      lead_type: Yup.string(),
      turnover: Yup.string(),
      stage: Yup.string(),
      lead_source: Yup.string(),
      country: Yup.string(),
      work_description: Yup.string()
      ,
      address: Yup.string()
      ,
      remark: Yup.string()
      ,
      mobile: Yup.string().required()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits')
        .required('Required field'),
      alternate_mobile1: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      alternate_mobile2: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      is_customer: Yup.boolean(),
      visiting_card: Yup.mixed<File>()
        .test("size", "size is allowed only less than 10mb",
          file => {
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(file.size <= 10 * 1024 * 1024)
            return true
          }
        )
        .test("type", " allowed only .jpg, .jpeg, .png, .gif .pdf .csv .xlsx .docs",
          file => {
            const Allowed = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"]
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(Allowed.includes(file.type))
            return true
          }
        )
    }),
    onSubmit: (values: TformData) => {
      let leadData = {
        customer_name: values.customer_name,
        customer_designation: values.customer_designation,
        mobile: values.mobile,
        email: values.email,
        city: values.city,
        state: values.state,
        country: values.country,
        address: values.address,
        remark: values.remark,
        work_description: values.work_description,
        turnover: values.turnover,
        lead_type: values.lead_type,
        stage: values.stage,
        alternate_mobile1: values.alternate_mobile1,
        alternate_mobile2: values.alternate_mobile2,
        alternate_email: values.alternate_email,
        lead_source: values.lead_source,
        name: values.name,
        lead_owners: values.lead_owners,
        is_customer: values.is_customer
      }
      let formdata = new FormData()
      formdata.append("body", JSON.stringify(leadData))
      if (values.visiting_card)
        formdata.append("visiting_card", values.visiting_card)
      mutate({ id: lead._id, body: formdata })
    }
  });
  useEffect(() => {
    if (isSuccess) {
     setChoice({ type: LeadChoiceActions.close_lead })
    }
  }, [isSuccess, setChoice])

  useEffect(() => {
    if (isFieldsSuccess) {
      setFields(data.data)
    }
  }, [isFieldsSuccess, data])

  console.log(formik.values)
  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack
        gap={2}
        pt={2}
      >
        {/* name */}

        <TextField
          autoFocus

          fullWidth

          error={
            formik.touched.name && formik.errors.name ? true : false
          }
          id="name"
          label="Lead Name"
          helperText={
            formik.touched.name && formik.errors.name ? formik.errors.name : ""
          }
          {...formik.getFieldProps('name')}
        />


        {/* customer name */}


        < TextField

          fullWidth
          error={
            formik.touched.customer_name && formik.errors.customer_name ? true : false
          }
          id="customer_name"
          label="Customer Name"
          helperText={
            formik.touched.customer_name && formik.errors.customer_name ? formik.errors.customer_name : ""
          }
          {...formik.getFieldProps('customer_name')}
        />


        {/* customer designiation */}


        < TextField

          fullWidth

          error={
            formik.touched.customer_designation && formik.errors.customer_designation ? true : false
          }
          id="customer_designation"
          label="Customer Designation"
          helperText={
            formik.touched.customer_designation && formik.errors.customer_designation ? formik.errors.customer_designation : ""
          }
          {...formik.getFieldProps('customer_designation')}
        />

        {/* mobile */}


        < TextField
          required


          type="string"
          error={
            formik.touched.mobile && formik.errors.mobile ? true : false
          }
          id="mobile"
          label="Mobile"
          fullWidth
          helperText={
            formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
          }
          {...formik.getFieldProps('mobile')}
        />

        {/* email */}


        < TextField

          fullWidth


          error={
            formik.touched.email && formik.errors.email ? true : false
          }
          id="email"
          label="Email"
          helperText={
            formik.touched.email && formik.errors.email ? formik.errors.email : ""
          }
          {...formik.getFieldProps('email')}
        />

        {/* alternate mobile */}



        < TextField

          fullWidth

          type="string"
          error={
            formik.touched.alternate_mobile1 && formik.errors.alternate_mobile1 ? true : false
          }
          id="alternate_mobile1"
          label="Alternate Mobile1"
          helperText={
            formik.touched.alternate_mobile1 && formik.errors.alternate_mobile1 ? formik.errors.alternate_mobile1 : ""
          }
          {...formik.getFieldProps('alternate_mobile1')}
        />

        {/* alternate mobile */}



        < TextField

          fullWidth

          type="string"
          error={
            formik.touched.alternate_mobile2 && formik.errors.alternate_mobile2 ? true : false
          }
          id="alternate_mobile2"
          label="Alternate Mobile2"
          helperText={
            formik.touched.alternate_mobile2 && formik.errors.alternate_mobile2 ? formik.errors.alternate_mobile2 : ""
          }
          {...formik.getFieldProps('alternate_mobile2')}
        />

        {/* turnover */}

        <TextField

          fullWidth
          error={
            formik.touched.turnover && formik.errors.turnover ? true : false
          }


          id="turnover"
          label="TurnOver"
          helperText={
            formik.touched.turnover && formik.errors.turnover ? formik.errors.turnover : ""
          }
          {...formik.getFieldProps('turnover')}
        />

        {/* alternate_email */}



        < TextField

          fullWidth


          error={
            formik.touched.alternate_email && formik.errors.alternate_email ? true : false
          }
          id="alternate_email"
          label="Alternate Email"
          helperText={
            formik.touched.alternate_email && formik.errors.alternate_email ? formik.errors.alternate_email : ""
          }
          {...formik.getFieldProps('alternate_email')}
        />

        {/* city */}

        < TextField
          select
          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.city && formik.errors.city ? true : false
          }
          id="city"
          label="City"
          fullWidth
          helperText={
            formik.touched.city && formik.errors.city ? formik.errors.city : ""
          }
          {...formik.getFieldProps('city')}
        >

          <option value={lead.city ? lead.city : ""}>
            {lead.city ? lead.city : ""}
          </option>
          {lead.city && <option value={""}>

          </option>}
          {
            Cities.map((city, index) => {
              return (<option key={index} value={city}>
                {city}
              </option>)
            })
          }
        </TextField>

        {/* state */}
        < TextField
          select
          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.state && formik.errors.state ? true : false
          }
          id="state"
          label="State"
          fullWidth
          helperText={
            formik.touched.state && formik.errors.state ? formik.errors.state : ""
          }
          {...formik.getFieldProps('state')}
        >
          <option value="">

          </option>
          {
            States.map(state => {
              return (<option key={state.code} value={state.state.toLowerCase()}>
                {state.state}
              </option>)
            })
          }
        </TextField>

        < TextField
          select
          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.stage && formik.errors.stage ? true : false
          }
          id="stage"
          label="Stage"
          fullWidth
          helperText={
            formik.touched.stage && formik.errors.stage ? formik.errors.stage : ""
          }
          {...formik.getFieldProps('stage')}
        >
          <option value="">

          </option>
          {

            fields && fields.stages && fields.stages.map(stage => {
              return (
                <option key={stage} value={stage}>
                  {stage}
                </option>)
            })
          }
        </TextField>

        {/* lead type */}



        < TextField



          select
          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.lead_type && formik.errors.lead_type ? true : false
          }

          id="lead_type"
          label="Lead Type"
          fullWidth
          helperText={
            formik.touched.lead_type && formik.errors.lead_type ? formik.errors.lead_type : ""
          }
          {...formik.getFieldProps('lead_type')}
        >
          <option value="">

          </option>
          {

            fields && fields.lead_types && fields.lead_types.map(type => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>)
            })
          }

        </TextField>


        {/* lead_source */}


        < TextField

          select


          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.lead_source && formik.errors.lead_source ? true : false
          }
          id="lead_source"
          label="Lead Source"
          fullWidth
          helperText={
            formik.touched.lead_source && formik.errors.lead_source ? formik.errors.lead_source : ""
          }
          {...formik.getFieldProps('lead_source')}
        >
          <option value="">
          </option>
          {

            fields && fields.lead_sources && fields.lead_sources.map(source => {
              return (
                <option key={source} value={source}>
                  {source}
                </option>)
            })
          }
        </TextField>

        {/* country */}



        < TextField


          select
          SelectProps={{
            native: true
          }}
          focused
          error={
            formik.touched.country && formik.errors.country ? true : false
          }
          id="country"
          label="country"
          fullWidth
          helperText={
            formik.touched.country && formik.errors.country ? formik.errors.country : ""
          }
          {...formik.getFieldProps('country')}
        >
          {
            Countries.map(country => {
              return (<option key={country.unicode} value={country.name}>
                {country.name}
              </option>)
            })
          }
        </TextField>

        {/* address */}

        < TextField



          multiline
          minRows={2}
          error={
            formik.touched.address && formik.errors.address ? true : false
          }
          id="address"
          label="Address"
          fullWidth
          helperText={
            formik.touched.address && formik.errors.address ? formik.errors.address : ""
          }
          {...formik.getFieldProps('address')}
        />

        {/* work_description */}



        < TextField

          multiline
          minRows={2}

          error={
            formik.touched.work_description && formik.errors.work_description ? true : false
          }
          id="work_description"
          label="Work Description"
          fullWidth
          helperText={
            formik.touched.work_description && formik.errors.work_description ? formik.errors.work_description : ""
          }
          {...formik.getFieldProps('work_description')}
        />


        {/* lead owners */}



        < TextField
          select
          SelectProps={{
            native: true,
            multiple: true
          }}
          focused
          required
          error={
            formik.touched.lead_owners && formik.errors.lead_owners ? true : false
          }
          id="lead_owners"
          label="Lead Owners"
          fullWidth
          helperText={
            formik.touched.lead_owners && formik.errors.lead_owners ? formik.errors.lead_owners : ""
          }
          {...formik.getFieldProps('lead_owners')}
        >

          {
            users.map((user, index) => {
              if (!user.crm_access_fields.is_hidden) {
                return (<option key={index} value={user._id}>
                  {user.username}
                </option>)
              }
              else return null
            })
          }
        </TextField>

        {/* remark */}

        < TextField

          multiline

          minRows={2}
          error={
            formik.touched.remark && formik.errors.remark ? true : false
          }
          id="remark"
          label="Remark"
          fullWidth
          helperText={
            formik.touched.remark && formik.errors.remark ? formik.errors.remark : ""
          }
          {...formik.getFieldProps('remark')}
        />

        {
          user?.created_by._id === user?._id ? <>
            <FormGroup>
              <FormControlLabel control={<Checkbox
                checked={Boolean(lead.is_customer)}
                {...formik.getFieldProps('is_customer')}
              />} label="Is A Customer" />
              <p>
                {formik.touched.is_customer && formik.errors.is_customer ? formik.errors.is_customer : ""}
              </p>
            </FormGroup>

          </> : null
        }

        <TextField
          fullWidth
          error={
            formik.touched.visiting_card && formik.errors.visiting_card ? true : false
          }
          helperText={
            formik.touched.visiting_card && formik.errors.visiting_card ? (formik.errors.visiting_card) : ""
          }

          label="Visting Card"
          focused

          type="file"
          name="visiting_card"
          onBlur={formik.handleBlur}
          onChange={(e) => {
            e.preventDefault()
            const target: Target = e.currentTarget
            let files = target.files
            if (files) {
              let file = files[0]
              formik.setFieldValue("visiting_card", file)
            }
          }}
        />

        <Button variant="contained" color="primary" type="submit"
          disabled={isLoading}
          fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Update Lead"}
        </Button>
      </Stack>
      {
        isError ? (
          <AlertBar message={error?.response.data.message} color="error" />
        ) : null
      }
      {
        isSuccess ? (
          <AlertBar message=" lead updated" color="success" />
        ) : null
      }

    </form>
  )
}

export default UpdateLeadForm