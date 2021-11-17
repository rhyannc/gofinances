import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.TextInput`
    width:              100%;
    padding:            14px 18px;
    font-family:        ${({ theme}) => theme.fonts.regular};
    font-size:          ${RFValue(14)}px;
    color:              ${({ theme }) => theme.colors.title};
    background-color:   ${({ theme }) => theme.colors.shape};
    border-radius:      5px;
    margin-bottom:      8px;
`;