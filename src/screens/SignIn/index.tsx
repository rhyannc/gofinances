import React, { useContext } from "react";
import { Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import GoogleSvg from '../../assets/google.svg';
import LogoSvg   from '../../assets/logo.svg';
import AppleSvg from '../../assets/apple.svg';

import { useAuth } from '../../hooks/auth';

import { SignInSocialButtton } from "../../components/SignInSocialButton";
 

import { 
    Container,
    Header,
    TitleWeapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
 } from "./styles";

export function SignIn(){
    const {signInWithGoogle} = useAuth();
    
    async function handleSignInWithGoogle(){
        try {
            await signInWithGoogle();

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectat a conta Google');
            
        }
        
    }

    return(
        <Container>
            <Header>
                <TitleWeapper>
                   <LogoSvg
                    width={RFValue(120)} 
                    height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finança de forma {'\n'}
                        muito simples {'\n'}
                    </Title>
                </TitleWeapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo{'\n'}
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButtton 
                        title="Entrar com Google"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />

                    <SignInSocialButtton 
                        title="Entrar com Apple"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>

        </Container>
    );
}