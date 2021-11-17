//import styled from 'styled-components/native';
import styled from "styled-components/native";
import { FlatList } from "react-native";
import { Feather } from '@expo/vector-icons';
import { RFPercentage, RFValue} from 'react-native-responsive-fontsize' 
import { getBottomSpace, getStatusBarHeight } from "react-native-iphone-x-helper"; //deixa o conteudo abaixo do notch no iphone
import { Platform} from 'react-native';
import { BorderlessButton } from "react-native-gesture-handler";

import { DataListProps} from '.';


export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
width:              100%;
height:             ${RFPercentage(42)}px;
background-color:   ${({ theme }) => theme.colors.primary};

justify-content: center;
align-items:     flex-start;
flex-direction:  row;
`;

export const UserWrapper = styled.View`
    width:           100%;
    padding:         0 24px; 
    margin-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + RFValue(28) : RFValue(28)}px;
    flex-direction:  row;
    justify-content: space-between;
    align-items:     center;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items:    center;
`;

export const Photo = styled.Image`
    width:          ${RFValue(48)}px;
    height:         ${RFValue(48)}px;
    border-radius:  10px;
 `;

export const User = styled.View`
    margin-left: 17px;
`;

export const UserGreeting = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size:   ${RFValue(18)}px;
    color:       ${({ theme }) => theme.colors.shape};
`;

export const UserName = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size:   ${RFValue(18)}px;
    color:       ${({ theme }) => theme.colors.shape}; 
`;

export const LogourButton =  styled(BorderlessButton)``;

export const Icon = styled(Feather)`
    color:      ${({theme}) => theme.colors.shape};
    font-size:  ${RFValue(30)}px;    
`;

export const HighlightCards = styled.ScrollView.attrs({
    horizontal:true, 
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingLeft: 24}
})`
    width: 100%;
    position: absolute;
    margin-top: ${RFPercentage(17)}px;
    
`;

export const Transactions = styled.View`
    flex: 1%;
    padding: 0 24px;
    margin-top: ${RFPercentage(10)}px;
`;

export const Title        = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};    
    color:      ${({theme}) => theme.colors.title};
    font-size:  ${RFValue(18)}px;  

    margin-bottom: 16px;
`;

export const TransactionList = styled(
    FlatList as new () => FlatList<DataListProps>
     ).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
         paddingBottom: getBottomSpace() }} /*ESPACAMENTO IPHONE*/
)``;

export const LoadContainer = styled.View`
        flex:1;
        justify-content:  center;
        align-items: center;
`;