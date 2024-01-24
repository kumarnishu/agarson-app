import styled from "styled-components"

export const STable = styled.table`
  border-collapse: collapse;
   width:100%;
   padding: 0px;
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
  &:hover{ background-color: rgba(0,0,0,0.05); cursor: pointer };
  text-align: left;
  background-color: white;
  padding:5px;
  padding-top: 0px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const STableHeadCell = styled.th`
  position:sticky;
  top: -3px;
  font-size: 9px;
  text-align: left;
  text-transform: uppercase;
  padding-inline:5px;
  padding-top: 0px;
  border: 1px solid #ddd;
  background-color: rgba(0,0,0,0.05);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const STableBody = styled.tbody`
  
`
