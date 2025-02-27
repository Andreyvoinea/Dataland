<template>
  <ViewFrameworkBase
    :companyID="companyId"
    :dataType="dataType"
    @updateActiveDataMetaInfoForChosenFramework="handleUpdateActiveDataMetaInfo"
  >
    <template v-slot:reportingPeriodDropdown>
      <Dropdown
        id="chooseReportingPeriodDropdown"
        v-model="chosenReportingPeriodInDropdown"
        :options="reportingPeriodsInDropdown"
        :placeholder="dataMetaInfoForDisplay?.reportingPeriod || 'Select...'"
        aria-label="Choose reporting period"
        :class="[dataMetaInfoForDisplay ? ['always-fill'] : '']"
        class="fill-dropdown ml-4"
        dropdownIcon="pi pi-angle-down"
        @change="handleChangeReportingPeriodEvent"
      />
    </template>

    <template v-slot:content>
      <div v-if="isDataIdToDisplayFound">
        <DatasetDisplayStatusIndicator
          :displayed-dataset="dataMetaInfoForDisplay"
          :received-map-of-reporting-periods-to-active-data-meta-info="
            receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo
          "
        />
        <div class="grid">
          <div class="col-12 text-left">
            <h2 class="mb-0" data-test="frameworkDataTableTitle">{{ humanizedDataDescription }}</h2>
          </div>
        </div>
        <div class="grid">
          <div class="col-7">
            <EuTaxonomyPanelNonFinancials
              v-if="dataType === DataTypeEnum.EutaxonomyNonFinancials"
              :dataID="dataIdForPanelWithValidType"
            />
            <EuTaxonomyPanelFinancials
              v-if="dataType === DataTypeEnum.EutaxonomyFinancials"
              :dataID="dataIdForPanelWithValidType"
            />
          </div>
        </div>
      </div>
      <div v-if="isWaitingForDataIdToDisplay" class="col-12 text-left" data-test="checkingIfAvailableIndicator">
        <h2>Checking if {{ humanizedDataDescription }} data available...</h2>
      </div>
      <div
        v-if="!isWaitingForDataIdToDisplay && receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo.size === 0"
        data-test="noDataForThisFrameworkPresentErrorIndicator"
      >
        <h2>No {{ humanizedDataDescription }} data present for this company.</h2>
      </div>
      <div v-if="isDataIdInUrlInvalid" data-test="noDataForThisDataIdPresentErrorIndicator">
        <h2>
          No {{ humanizedDataDescription }} data could be found for the data ID passed in the URL for this company and
          framework.
        </h2>
      </div>
      <div v-if="isReportingPeriodInUrlInvalid" data-test="noDataForThisReportingPeriodPresentErrorIndicator">
        <h2>
          No {{ humanizedDataDescription }} data could be found for the reporting period passed in the URL for this
          company.
        </h2>
      </div>
    </template>
  </ViewFrameworkBase>
</template>

<script lang="ts">
import ViewFrameworkBase from "@/components/generics/ViewFrameworkBase.vue";
import { DataMetaInformation, DataTypeEnum } from "@clients/backend";
import { defineComponent, inject } from "vue";
import Dropdown, { DropdownChangeEvent } from "primevue/dropdown";
import Keycloak from "keycloak-js";
import { ApiClientProvider } from "@/services/ApiClients";
import { assertDefined } from "@/utils/TypeScriptUtils";
import { AxiosError } from "axios";
import EuTaxonomyPanelNonFinancials from "@/components/resources/frameworkDataSearch/euTaxonomy/EuTaxonomyPanelNonFinancials.vue";
import EuTaxonomyPanelFinancials from "@/components/resources/frameworkDataSearch/euTaxonomy/EuTaxonomyPanelFinancials.vue";
import { humanizeString } from "@/utils/StringHumanizer";
import DatasetDisplayStatusIndicator from "@/components/resources/frameworkDataSearch/DatasetDisplayStatusIndicator.vue";

export default defineComponent({
  name: "ViewSingleDatasetDisplayBase",
  components: {
    DatasetDisplayStatusIndicator,
    ViewFrameworkBase,
    Dropdown,
    EuTaxonomyPanelFinancials,
    EuTaxonomyPanelNonFinancials,
  },
  props: {
    companyId: {
      type: String,
    },
    dataId: {
      type: String,
    },
    reportingPeriod: {
      type: String,
    },
    dataType: {
      type: String,
    },
  },
  data() {
    return {
      isWaitingForDataIdToDisplay: true,
      receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo: {} as Map<string, DataMetaInformation>,
      reportingPeriodsInReceivedDataMetaInfo: [] as Array<string>,
      reportingPeriodsInDropdown: [] as Array<string>,
      chosenReportingPeriodInDropdown: "",
      dataMetaInfoForDisplay: null as DataMetaInformation | null,
      isDataIdInUrlInvalid: false,
      isReportingPeriodInUrlInvalid: false,
      isDataIdToDisplayFound: false,
      DataTypeEnum,
    };
  },

  setup() {
    return {
      getKeycloakPromise: inject<() => Promise<Keycloak>>("getKeycloakPromise"),
    };
  },
  watch: {
    dataId(newDataId: string) {
      if (newDataId) {
        void this.getMetaDataForDataId(newDataId);
      }
    },
    reportingPeriod(newReportingPeriod: string) {
      this.switchToActiveDatasetForNewlyChosenReportingPeriod(newReportingPeriod);
    },
  },

  computed: {
    humanizedDataDescription() {
      return humanizeString(this.dataType);
    },

    dataIdForPanelWithValidType() {
      if (this.dataMetaInfoForDisplay?.dataType === this.dataType) {
        return this.dataMetaInfoForDisplay?.dataId;
      } else return "loading";
    },
  },
  methods: {
    /**
     * Method to prepare the display of given data meta information
     *
     * @param dataMetaInfoForDisplay The data meta information object to be displayed
     */
    processDataMetaInfoForDisplay(dataMetaInfoForDisplay: DataMetaInformation) {
      this.chosenReportingPeriodInDropdown = dataMetaInfoForDisplay.reportingPeriod;
      this.isDataIdToDisplayFound = true;
      this.dataMetaInfoForDisplay = dataMetaInfoForDisplay;
    },

    /**
     * Handles the change event of the reporting period dropdown to make the page display the active data set for the
     * newly selected reporting period.
     *
     * @param dropDownChangeEvent The object which is passed by the change event of the reporting period dropdown
     */
    handleChangeReportingPeriodEvent(dropDownChangeEvent: DropdownChangeEvent) {
      this.routerPushToReportingPeriod(String(dropDownChangeEvent.value));
    },

    /**
     * Switch to the active data set of a new reporting period, including adapting the corresponding route
     *
     * @param newReportingPeriod The desired new reporting period
     */
    switchToActiveDatasetForNewlyChosenReportingPeriod(newReportingPeriod: string) {
      this.isReportingPeriodInUrlInvalid = false;
      this.isDataIdInUrlInvalid = false;
      const dataMetaInfoForNewlyChosenReportingPeriod =
        this.receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo.get(newReportingPeriod);
      if (dataMetaInfoForNewlyChosenReportingPeriod) {
        this.processDataMetaInfoForDisplay(dataMetaInfoForNewlyChosenReportingPeriod);
        this.routerPushToReportingPeriod(dataMetaInfoForNewlyChosenReportingPeriod.reportingPeriod);
      } else {
        if (newReportingPeriod) {
          this.handleInvalidReportingPeriodPassedInUrl();
        }
      }
    },

    /**
     * Method to set route to a specific reporting period
     *
     * @param reportingPeriod Specific reporting period the route should end with
     */
    routerPushToReportingPeriod(reportingPeriod: string) {
      if (this.companyId != null && this.dataType != null) {
        this.$router
          .push(`/companies/${this.companyId}/frameworks/${this.dataType}/reportingPeriods/${reportingPeriod}`)
          .catch((err) =>
            console.log("Setting route for reporting period " + reportingPeriod + " failed with error " + String(err))
          );
      }
    },

    /**
     * Switches to the active dataset for the currently chosen reporting period.
     */
    handleClickOnSwitchToActiveDatasetForCurrentlyChosenReportingPeriodButton() {
      this.switchToActiveDatasetForNewlyChosenReportingPeriod(
        assertDefined(this.dataMetaInfoForDisplay?.reportingPeriod)
      );
    },

    /**
     * Gets the keys from a map and returns them in an alphabeticall sorted array
     *
     * @param inputMap The map that should be used for this operation
     * @returns an array containing the keys of the map alphabetically sorted
     */
    getKeysFromMapAndReturnAsAlphabeticallySortedArray(inputMap: Map<string, object>): Array<string> {
      return Array.from(inputMap.keys()).sort((reportingPeriodA, reportingPeriodB) => {
        if (reportingPeriodA > reportingPeriodB) return -1;
        else return 0;
      });
    },

    /**
     * Method to handle the update of the currently active data meta information for the chosen framework
     *
     * @param receivedMapOfReportingPeriodsToActiveDataMetaInfo 1-to-1 map between reporting periods and corresponding
     * active data meta information objects
     */
    handleUpdateActiveDataMetaInfo(
      receivedMapOfReportingPeriodsToActiveDataMetaInfo: Map<string, DataMetaInformation>
    ) {
      this.receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo =
        receivedMapOfReportingPeriodsToActiveDataMetaInfo;
      this.reportingPeriodsInDropdown = this.getKeysFromMapAndReturnAsAlphabeticallySortedArray(
        receivedMapOfReportingPeriodsToActiveDataMetaInfo
      );
      this.chooseDataMetaInfoForDisplayedDataset().catch((err) =>
        console.log("Retrieving data meta info failed with error " + String(err))
      );
      this.isWaitingForDataIdToDisplay = false;
    },

    /**
     *  This controller-method decides how the displayed dataset should be chosen.
     *  It does so by checking the path-params in the URL, which are handled as props in this vue component.
     *  Case A: Just a data ID is found in the URL, therefore this specific dataset should be displayed.
     *  Case B: No data ID is found in the URL, but a reporting period. Therefore the active dataset for this reporting
     *  period should be displayed.
     *  Case C: No data ID or reporting period is found in the URL. A default function should now decide, which dataset
     *  will be displayed.
     */
    async chooseDataMetaInfoForDisplayedDataset() {
      if (this.dataId) {
        await this.getMetaDataForDataId(this.dataId);
      } else if (!this.dataId && this.reportingPeriod) {
        this.switchToActiveDatasetForNewlyChosenReportingPeriod(this.reportingPeriod);
      } else {
        this.switchToDefaultDatasetToDisplay();
      }
    },

    /**
     * Method to retrieve meta data for a specific data ID and prepare displaying them
     *
     * @param dataId The desired data ID for which the meta data are wanted
     */
    async getMetaDataForDataId(dataId: string) {
      try {
        const metaDataControllerApi = await new ApiClientProvider(
          assertDefined(this.getKeycloakPromise)()
        ).getMetaDataControllerApi();
        const apiResponse = await metaDataControllerApi.getDataMetaInfo(dataId);
        const dataMetaInfoForDataSetWithDataIdFromUrl = apiResponse.data;
        if (
          dataMetaInfoForDataSetWithDataIdFromUrl.companyId != this.companyId ||
          dataMetaInfoForDataSetWithDataIdFromUrl.dataType != this.dataType
        ) {
          this.handleInvalidDataIdPassedInUrl();
        } else {
          this.processDataMetaInfoForDisplay(dataMetaInfoForDataSetWithDataIdFromUrl);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status == 404) {
          this.handleInvalidDataIdPassedInUrl();
        }
      }
    },

    /**
     * Called when the dataId in the url is found to be invalid (i.e. belongs to a different company or does not exist)
     */
    handleInvalidDataIdPassedInUrl() {
      this.dataMetaInfoForDisplay = null;
      this.chosenReportingPeriodInDropdown = "";
      this.isDataIdToDisplayFound = false;
      this.isDataIdInUrlInvalid = true;
    },

    /**
     * Called when the reporting period in the url does not belong to a designated dataset
     */
    handleInvalidReportingPeriodPassedInUrl() {
      this.dataMetaInfoForDisplay = null;
      this.chosenReportingPeriodInDropdown = "";
      this.isDataIdToDisplayFound = false;
      this.isReportingPeriodInUrlInvalid = true;
    },

    /**
     * Method to switch to default data set to display, including replacing the route by the one corresponding to the
     * latest chosen reporting period in dropdown
     */
    switchToDefaultDatasetToDisplay() {
      const latestDataMetaInformation = this.getActiveDataMetaInfoFromLatestReportingPeriodIfParsableAsNumber();
      if (latestDataMetaInformation && this.companyId && this.dataType) {
        this.$router
          .replace(
            `/companies/${this.companyId}/frameworks/${this.dataType}/reportingPeriods/${latestDataMetaInformation.reportingPeriod}`
          )
          .catch((err) => console.log("Replacing route failed with error " + String(err)));
      }
    },

    /**
     * Method to retrieve the active data meta information for the latest reporting period
     *
     * @returns the active data meta information from the latest reporting period
     */
    getActiveDataMetaInfoFromLatestReportingPeriodIfParsableAsNumber(): DataMetaInformation {
      const [firstActiveDataMetaInfo] = this.receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo.values();
      const listOfNumbersInReportingPeriods: number[] = [];
      this.reportingPeriodsInDropdown.forEach((reportingPeriodAsString) => {
        const parsedReportingPeriod = parseInt(reportingPeriodAsString);
        if (!Number.isNaN(parsedReportingPeriod)) {
          listOfNumbersInReportingPeriods.push(parsedReportingPeriod);
        }
      });
      if (listOfNumbersInReportingPeriods.length > 0) {
        const latestReportingPeriod = listOfNumbersInReportingPeriods.reduce((a, b) => Math.max(a, b)).toString();
        const activeDataMetaInfoForLatestReportingPeriod =
          this.receivedMapOfDistinctReportingPeriodsToActiveDataMetaInfo.get(latestReportingPeriod);
        if (activeDataMetaInfoForLatestReportingPeriod) {
          return activeDataMetaInfoForLatestReportingPeriod;
        } else {
          return firstActiveDataMetaInfo;
        }
      } else return firstActiveDataMetaInfo;
    },
  },
});
</script>
