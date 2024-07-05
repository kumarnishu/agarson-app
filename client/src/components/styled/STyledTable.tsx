import styled from "styled-components"

export const STable = styled.table`
  border-collapse: collapse;
   width:100%;
   padding: 0px;
`

export const STableBody = styled.tbody`
  
`

export const STableHead = styled.thead`
  padding: 0px;
  position:sticky;
  top: -3px;
  background-color:white;
  z-index:1;
`
export const STableRow = styled.tr`
  &:hover{ background-color: rgba(0,0,0,0.05); cursor: pointer }
`
export const STableCell = styled.td`
  text-align: left;
  padding-left:3px;
  padding: 5px;
  border: 1px solid #ddd;
  font-size: 13px;
  white-space: nowrap;
  text-transform: capitalize;
  max-width:350px;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const STableHeadCell = styled.th`
  position:sticky;
  z-index: 1;
  font-size: 11px;
  padding-left:3px;
  padding: 5px;
  text-align: left;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid #ddd;
  background-color: rgba(0,0,0,0.05);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
