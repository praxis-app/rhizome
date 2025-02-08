import {
  FormControl,
  FormGroup,
  FormGroupProps,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { ChangeEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MutateChannelReq } from '../../types/channel.types';

interface Props {
  register: UseFormReturn<MutateChannelReq>['register'];
  sx?: FormGroupProps['sx'];
}

const ChannelFormFields = ({ register, sx }: Props) => {
  const { onChange, ...inputProps } = register('name');

  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\s/g, '-');
    onChange(e);
  };

  return (
    <FormGroup sx={{ gap: 1.5, paddingBottom: 3.5, ...sx }}>
      <FormControl>
        <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
          {t('channels.form.name')}
        </FormLabel>
        <OutlinedInput
          autoComplete="off"
          onChange={handleChange}
          {...inputProps}
        />
      </FormControl>
    </FormGroup>
  );
};

export default ChannelFormFields;
