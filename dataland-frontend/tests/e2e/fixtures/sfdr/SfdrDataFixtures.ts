import { faker } from "@faker-js/faker";
import { SfdrData } from "@clients/backend";
import {
  generateNumericOrEmptyDatapoint,
  generateYesNoOrEmptyDatapoint,
  generateReferencedReports,
} from "@e2e/fixtures/common/DataPointFixtures";
import { randomYesNoNaUndefined } from "@e2e/fixtures/common/YesNoFixtures";
import { randomFutureDate } from "@e2e/fixtures/common/DateFixtures";
import { generateIso4217CurrencyCode } from "@e2e/fixtures/common/CurrencyFixtures";
import { randomEuroValue, randomNumber } from "@e2e/fixtures/common/NumberFixtures";
import { randomFiscalYearDeviationOrUndefined } from "@e2e/fixtures/common/FiscalYearDeviationFixtures";

/**
 * Generates a random SFDR dataset
 *
 * @returns a random SFDR dataset
 */
export function generateSfdrData(): SfdrData {
  const reports = generateReferencedReports();
  return {
    social: {
      general: {
        fiscalYear: randomFiscalYearDeviationOrUndefined(),
        fiscalYearEnd: randomFutureDate(),
        groupLevelAnnualReport: randomYesNoNaUndefined(),
        annualReport: faker.datatype.string(),
        annualReportDate: randomFutureDate(),
        annualReportCurrency: generateIso4217CurrencyCode(),
        sustainabilityReport: faker.datatype.string(),
        groupLevelSustainabilityReport: randomYesNoNaUndefined(),
        sustainabilityReportDate: randomFutureDate(),
        sustainabilityReportCurrency: generateIso4217CurrencyCode(),
        integratedReport: faker.datatype.string(),
        groupLevelIntegratedReport: randomYesNoNaUndefined(),
        integratedReportDate: randomFutureDate(),
        integratedReportCurrency: generateIso4217CurrencyCode(),
        esefReport: faker.datatype.string(),
        groupLevelEsefReport: randomYesNoNaUndefined(),
        esefReportDate: randomFutureDate(),
        esefReportCurrency: generateIso4217CurrencyCode(),
        scopeOfEntities: randomYesNoNaUndefined(),
      },
      socialAndEmployeeMatters: {
        humanRightsLegalProceedings: generateYesNoOrEmptyDatapoint(reports),
        iloCoreLabourStandards: generateYesNoOrEmptyDatapoint(reports),
        environmentalPolicy: generateYesNoOrEmptyDatapoint(reports),
        corruptionLegalProceedings: generateYesNoOrEmptyDatapoint(reports),
        transparencyDisclosurePolicy: generateYesNoOrEmptyDatapoint(reports),
        humanRightsDueDiligencePolicy: generateYesNoOrEmptyDatapoint(reports),
        childForcedDiscriminationPolicy: generateYesNoOrEmptyDatapoint(reports),
        iso14001: generateYesNoOrEmptyDatapoint(reports),
        briberyCorruptionPolicy: generateYesNoOrEmptyDatapoint(reports),
        fairBusinessMarketingAdvertisingPolicy: generateYesNoOrEmptyDatapoint(reports),
        technologiesExpertiseTransferPolicy: generateYesNoOrEmptyDatapoint(reports),
        fairCompetitionPolicy: generateYesNoOrEmptyDatapoint(reports),
        violationOfTaxRulesAndRegulation: generateYesNoOrEmptyDatapoint(reports),
        unGlobalCompactPrinciplesCompliancePolicy: generateYesNoOrEmptyDatapoint(reports),
        oecdGuidelinesForMultinationalEnterprisesPolicy: generateYesNoOrEmptyDatapoint(reports),
        averageGrossHourlyEarningsMaleEmployees: generateNumericOrEmptyDatapoint(reports, randomEuroValue(0, 100)),
        averageGrossHourlyEarningsFemaleEmployees: generateNumericOrEmptyDatapoint(reports, randomEuroValue(0, 100)),
        femaleBoardMembers: generateNumericOrEmptyDatapoint(reports),
        maleBoardMembers: generateNumericOrEmptyDatapoint(reports),
        controversialWeaponsExposure: generateYesNoOrEmptyDatapoint(reports),
        workplaceAccidentPreventionPolicy: generateYesNoOrEmptyDatapoint(reports),
        rateOfAccidents: generateNumericOrEmptyDatapoint(reports),
        workdaysLost: generateNumericOrEmptyDatapoint(reports, randomNumber(10000)),
        supplierCodeOfConduct: generateYesNoOrEmptyDatapoint(reports),
        grievanceHandlingMechanism: generateYesNoOrEmptyDatapoint(reports),
        whistleblowerProtectionPolicy: generateYesNoOrEmptyDatapoint(reports),
        reportedIncidentsOfDiscrimination: generateNumericOrEmptyDatapoint(reports),
        sanctionsIncidentsOfDiscrimination: generateNumericOrEmptyDatapoint(reports),
        ceoToEmployeePayGap: generateNumericOrEmptyDatapoint(reports),
      },
      humanRights: {
        humanRightsPolicy: generateYesNoOrEmptyDatapoint(reports),
        humanRightsDueDiligence: generateYesNoOrEmptyDatapoint(reports),
        traffickingInHumanBeingsPolicy: generateYesNoOrEmptyDatapoint(reports),
        reportedChildLabourIncidents: generateYesNoOrEmptyDatapoint(reports),
        reportedForcedOrCompulsoryLabourIncidents: generateYesNoOrEmptyDatapoint(reports),
        reportedIncidentsOfHumanRights: generateNumericOrEmptyDatapoint(reports),
      },
      greenSecurities: {
        securitiesNotCertifiedAsGreen: generateYesNoOrEmptyDatapoint(reports),
      },
      anticorruptionAndAntibribery: {
        reportedCasesOfBriberyCorruption: generateYesNoOrEmptyDatapoint(reports),
        reportedConvictionsOfBriberyCorruption: generateNumericOrEmptyDatapoint(reports),
        reportedFinesOfBriberyCorruption: generateNumericOrEmptyDatapoint(reports, randomEuroValue()),
      },
    },
    environmental: {
      greenhouseGasEmissions: {
        scope1: generateNumericOrEmptyDatapoint(reports),
        scope2: generateNumericOrEmptyDatapoint(reports),
        scope3: generateNumericOrEmptyDatapoint(reports),
        enterpriseValue: generateNumericOrEmptyDatapoint(reports, randomEuroValue()),
        totalRevenue: generateNumericOrEmptyDatapoint(reports, randomEuroValue()),
        fossilFuelSectorExposure: generateYesNoOrEmptyDatapoint(reports),
      },
      energyPerformance: {
        renewableEnergyProduction: generateNumericOrEmptyDatapoint(reports),
        renewableEnergyConsumption: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumption: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyProduction: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceA: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceB: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceC: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceD: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceE: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceF: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceG: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceH: generateNumericOrEmptyDatapoint(reports),
        highImpactClimateSectorEnergyConsumptionNaceL: generateNumericOrEmptyDatapoint(reports),
        totalHighImpactClimateSectorEnergyConsumption: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionFossilFuels: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionCrudeOil: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionNaturalGas: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionLignite: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionCoal: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionNuclearEnergy: generateNumericOrEmptyDatapoint(reports),
        nonRenewableEnergyConsumptionOther: generateNumericOrEmptyDatapoint(reports),
      },
      biodiversity: {
        primaryForestAndWoodedLandOfNativeSpeciesExposure: generateYesNoOrEmptyDatapoint(reports),
        protectedAreasExposure: generateYesNoOrEmptyDatapoint(reports),
        rareOrEndangeredEcosystemsExposure: generateYesNoOrEmptyDatapoint(reports),
      },
      water: {
        emissionsToWater: generateNumericOrEmptyDatapoint(reports),
        waterConsumption: generateNumericOrEmptyDatapoint(reports),
        waterReused: generateNumericOrEmptyDatapoint(reports),
        waterManagementPolicy: generateYesNoOrEmptyDatapoint(reports),
        waterStressAreaExposure: generateYesNoOrEmptyDatapoint(reports),
      },
      waste: {
        hazardousWaste: generateNumericOrEmptyDatapoint(reports),
        manufactureOfAgrochemicalPesticidesProducts: generateYesNoOrEmptyDatapoint(reports),
        landDegradationDesertificationSoilSealingExposure: generateYesNoOrEmptyDatapoint(reports),
        sustainableAgriculturePolicy: generateYesNoOrEmptyDatapoint(reports),
        sustainableOceansAndSeasPolicy: generateYesNoOrEmptyDatapoint(reports),
        wasteNonRecycled: generateNumericOrEmptyDatapoint(reports),
        threatenedSpeciesExposure: generateYesNoOrEmptyDatapoint(reports),
        biodiversityProtectionPolicy: generateYesNoOrEmptyDatapoint(reports),
        deforestationPolicy: generateYesNoOrEmptyDatapoint(reports),
      },
      emissions: {
        inorganicPollutants: generateNumericOrEmptyDatapoint(reports),
        airPollutants: generateNumericOrEmptyDatapoint(reports),
        ozoneDepletionSubstances: generateNumericOrEmptyDatapoint(reports),
        carbonReductionInitiatives: generateYesNoOrEmptyDatapoint(reports),
      },
    },
    referencedReports: reports,
  };
}
