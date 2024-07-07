import { Box, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../components/styled/STyledTable'
import { Search } from '@mui/icons-material'
import FuzzySearch from 'fuzzy-search'
import { ISaleAnalysisReport } from '../../types/template.type'
import { GetSaleAnalysisReports } from '../../services/ErpServices'

export default function SaleAnalysisReport() {
  const [reports, setSaleAnalysissReport] = useState<ISaleAnalysisReport[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [preFilteredData, setPreFilteredData] = useState<ISaleAnalysisReport[]>([])
  const { data, isLoading } = useQuery<AxiosResponse<ISaleAnalysisReport[]>, BackendError>(["sale_analysisreports"], GetSaleAnalysisReports)


  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(reports, ["state.state"], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setSaleAnalysissReport(result)
    }
    if (!filter)
      setSaleAnalysissReport(preFilteredData)

  }, [filter])

  useEffect(() => {
    if (data && !filter) {
      setSaleAnalysissReport(data.data)
      setPreFilteredData(data.data)
    }
  }, [data])

  return (
    <>

      {
        isLoading && <LinearProgress />
      }

      <Stack
        spacing={2}
        padding={1}
        direction="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography
          variant={'h6'}
          component={'h1'}
        >
          Sale Analysis Report
        </Typography>
        <Stack direction={'row'} gap={2} alignItems={'center'}>
          <TextField
            fullWidth
            size="small"
            onChange={(e) => {
              setFilter(e.currentTarget.value)
            }}
            placeholder={`${reports?.length} records...`}
            style={{
              fontSize: '1.1rem',
              border: '0',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Stack>


      </Stack >

      {/* table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && <Box sx={{
        overflow: "auto",
        height: '78vh'
      }}>
        <STable
        >
          <STableHead
          >
            <STableRow>
              <STableHeadCell
              >
                State
              </STableHeadCell>
              <STableHeadCell
              >
                Monthly Target
              </STableHeadCell>
              <STableHeadCell
              >
                Monthly Achievement
              </STableHeadCell>
              <STableHeadCell
              >
                Monthly Percentage(%)
              </STableHeadCell>
              <STableHeadCell
              >
                Annual Target
              </STableHeadCell>
              <STableHeadCell
              >
                Annual Achievement
              </STableHeadCell>
              <STableHeadCell
              >
                Annual Percentage(%)
              </STableHeadCell>
              <STableHeadCell
              >
                Annual Old Sale
              </STableHeadCell>
              <STableHeadCell
              >
                Comparison Last Year(%)
              </STableHeadCell>
            </STableRow>
          </STableHead>
          <STableBody >
            {
              reports && reports.map((report, index) => {
                return (
                  <STableRow
                    key={index}
                  >

                    <STableCell
                    >
                      {report.state&&report.state.state}
                    </STableCell>
                    <STableCell
                    >
                      {report.monthly_target && report.monthly_target}
                    </STableCell>
                    <STableCell
                    >
                      {report.monthly_achivement && report.monthly_achivement}
                    </STableCell>
                    <STableCell
                    >
                      {report.monthly_percentage && report.monthly_percentage}
                    </STableCell>
                    <STableCell
                    >
                      {report.annual_target && report.annual_target}
                    </STableCell>
                    <STableCell
                    >
                      {report.annual_achivement && report.annual_achivement}
                    </STableCell>
                    <STableCell
                    >
                      {report.annual_percentage && report.annual_percentage}
                    </STableCell>
                    <STableCell
                    >
                      {report.last_year_sale && report.last_year_sale}
                    </STableCell>
                    <STableCell
                    >
                      {report.last_year_sale_percentage_comparison && report.last_year_sale_percentage_comparison}
                    </STableCell>
                  </STableRow>
                )
              })}
          </STableBody>
        </STable>
      </Box >}
    </>

  )

}

