import styled from "styled-components"

export const STable = styled.table`
  border-collapse: collapse;
   width:100%;
`
export const STableHead = styled.thead`
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
  background-color: white;
  padding:5px;
  display:inlineblock;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const STableHeadCell = styled.th`
  position:sticky;
  top: -3px;
  text-align: left;
  padding-inline:10px;
  display:inlineblock;
  border: 1px solid #ddd;
  background-color: rgba(0,0,0,0.05);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const STableBody = styled.tbody`
  
`
