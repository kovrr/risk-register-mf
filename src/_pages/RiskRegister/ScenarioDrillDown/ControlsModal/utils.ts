import {
  getCisText,
  getCisV8Text,
  getISOText,
  getNistText,
  getNistV2Text,
} from '@/utils/mitigationUtils';
import { abbrToText as cisV7AbbrToText } from '@/options/cisControls';
import { abbrToText as cisV8AbbrToText } from '@/options/cisV8Controls';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFrameworkControlsMapping = () => {
  const { t: tIso } = useTranslation('common', {
    keyPrefix: 'sphere.securityProfiles.iso27001.drawer',
  });
  const ISOtrans = tIso('controls', { returnObjects: true });

  const { t: tTisax } = useTranslation('common', {
    keyPrefix: 'sphere.securityProfiles.tisax',
  });
  const tisaxTrans = tTisax('controls', { returnObjects: true });

  const frameworkMap = useMemo(
    () =>
      ({
        cis_v8_safeguards: {
          controls: 'relevant_cis_v8_safeguards',
          implementationLevel: 'cis_v8_safeguards',
          title: 'CIS v.8 - Safeguards Level',
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) =>
            implementedLevel === 1 ? 0 : 1,
          codeToText: cisV8AbbrToText,
        },
        cis: {
          controls: 'relevant_cis_controls',
          implementationLevel: 'cis_implementation_level',
          title: 'CIS Controls v.7 - Controls Level',
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) =>
            implementedLevel === 1 ? 0 : 1,

          codeToText: getCisText,
        },
        cis_v7_safeguards: {
          controls: 'relevant_cis_v7_safeguards',
          implementationLevel: 'cis_v7_safeguards',
          title: 'CIS Controls v.7 - Safeguards Level',
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) =>
            implementedLevel === 1 ? 0 : 1,
          codeToText: cisV7AbbrToText,
        },
        nist: {
          controls: 'relevant_nist_controls',
          implementationLevel: 'nist_implementation_level',
          title: 'NIST CSF',
          codeToText: getNistText,
          isImplemented: (implementedLevel: number) => implementedLevel === 0,
          invertImplemented: (implementedLevel: number) => {
            return implementedLevel === 0 ? 1 : 0;
          },
        },
        nist_csf_v2: {
          controls: 'relevant_nist_v2_controls',
          implementationLevel: 'nist_v2_safeguard_implementation',
          title: 'NIST CSF v2',
          codeToText: getNistV2Text,
          isImplemented: (implementedLevel: number) => implementedLevel === 0,
          invertImplemented: (implementedLevel: number) => {
            return implementedLevel === 0 ? 1 : 0;
          },
        },
        iso: {
          controls: 'relevant_iso27001_controls',
          implementationLevel: 'iso27001_implementation_level',
          title: 'ISO 27001',
          codeToText: (key: any) => getISOText(key, ISOtrans),
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) =>
            implementedLevel === 1 ? 0 : 1,
        },
        cis_v8: {
          controls: 'relevant_cis_v8_controls',
          implementationLevel: 'cis_v8_implementation_level_igs',
          codeToText: getCisV8Text,
          title: 'CIS Controls v.8 - Controls Level',
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) => {
            return implementedLevel === 1 ? 0 : 1;
          },
        },
        tisax: {
          controls: 'relevant_tisax_controls',
          implementationLevel: 'tisax_implementation_level',
          title: 'TISAX Controls',
          codeToText: (key: string) => {
            const control = (tisaxTrans as Record<string, any>)[key];
            return control || {
              title: key,
              secondaryTitle: key,
              desc: key,
              classifications: ["Tisax"]
            };
          },
          isImplemented: (implementedLevel: number) => implementedLevel === 1,
          invertImplemented: (implementedLevel: number) =>
            implementedLevel === 1 ? 0 : 1,
        },
      }) as const,
    [ISOtrans, tisaxTrans],
  );

  return frameworkMap;
};
