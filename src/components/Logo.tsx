import type { FC } from 'react';
import type { Theme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { SxProps } from '@material-ui/system';

interface LogoProps {
  sx?: SxProps<Theme>;
}

const LogoRoot = experimentalStyled('svg')``;

const Logo: FC<LogoProps> = (props) => (
  <LogoRoot height="172" version="1.1" viewBox="0 0 172 172" width="172" {...props}>
    <svg width="172" height="172" viewBox="0 0 172 172" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70.9603 57.1596L52.6801 46.276L50.6859 45.1129L49.9381 44.6975V134.176L70.9603 146.804V131.185V94.3799V57.1596Z"
        fill="#FF0094"
      />
      <path d="M77.3583 90.6412L102.618 75.8528L77.3583 60.8983V90.6412Z" fill="#FF0094" />
      <path
        d="M148.734 0H23.2657C10.4696 0 0 10.4682 0 23.2626V148.715C0 161.509 10.4696 171.977 23.2657 171.977H148.734C161.53 171.977 172 161.509 172 148.715V23.2626C172 10.4682 161.53 0 148.734 0ZM138.265 62.3107V91.7213L77.3583 127.446V158.269L43.54 137.831V40.8758V37.2202L46.6975 35.3094L72.6221 19.6071L135.107 56.7442L138.265 58.6551V62.3107Z"
        fill="#FF0094"
      />
      <path d="M108.933 79.5915L77.3583 98.0354V119.969L131.866 87.9827V66.0493L108.933 79.5915Z" fill="#FF0094" />
      <path d="M128.792 60.4829L72.7052 27.0844L53.0125 38.9649L108.933 72.1142L128.792 60.4829Z" fill="#FF0094" />
    </svg>
  </LogoRoot>
);

export default Logo;
