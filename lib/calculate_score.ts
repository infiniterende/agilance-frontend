import { ASSESSMENT_QUESTIONS } from "./assessment_questions";

type ChestPainProps = {
  location: boolean;
  trigger: boolean;
  relief: boolean;
};

const getTruthyVal = (val: boolean) => {
  return val ? 1 : 0;
};
export const classify_chest_pain = ({
  location,
  trigger,
  relief,
}: ChestPainProps) => {
  const score =
    getTruthyVal(location) + getTruthyVal(trigger) + getTruthyVal(relief);

  switch (score) {
    case 3:
      return "typical";
    case 2:
      return "atypical";
    case 1:
      return "non-specific";
    case 0:
      return "non-specfic";
  }
};

type RiskFactors = {
  age: number;
  male: boolean;
  chest_pain_type: string;
  diabetes: boolean;
  hypertension: boolean;
  hyperlipidemia: boolean;
  smoking: boolean;
};
export const cadc_clinical_risk = ({
  age,
  male,
  chest_pain_type,
  diabetes,
  hypertension,
  hyperlipidemia,
  smoking,
}: RiskFactors) => {
  const b0 = -7.539;
  const b_age = 0.062;
  const b_male = 1.332;
  const b_atyp = 0.633;
  const b_typ = 1.998;
  const b_diab = 0.828;
  const b_htn = 0.338;
  const b_dlp = 0.422;
  const b_smk = 0.461;
  const b_interact = -0.402;

  const maleType = getTruthyVal(male);
  let cp_atyp = 0;
  if (chest_pain_type == "atypical") {
    cp_atyp = 1;
  } else {
    cp_atyp = 0;
  }

  let cp_typ = 0;
  if (chest_pain_type == "typical") {
    cp_typ = 1;
  } else {
    cp_typ = 0;
  }
  let dm = 0;
  diabetes ? (dm = 1) : (dm = 0);

  let htn = 0;

  hypertension ? (htn = 1) : (htn = 0);

  let dlp = 0;

  hyperlipidemia ? (dlp = 1) : (dlp = 0);

  let smk = 0;

  smoking ? (smk = 1) : (smk = 0);

  const logit_p =
    b0 +
    b_age * age +
    b_male * maleType +
    b_atyp * cp_atyp +
    b_typ * cp_typ +
    b_diab * dm +
    b_htn * htn +
    b_dlp * dlp +
    b_smk * smk +
    b_interact * (dm * cp_typ);

  return 1 / (1 + Math.exp(-logit_p));
};
