import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import { Show } from "react-admin";
import { RedirectByType } from "@semapps/archipelago-layout";
import React from "react";

const ResourceRedirect = props => (
  <Show {...props}>
    <RedirectByType typesMap={{ Skill: 'pair:Skill' }} />
  </Show>
);

export default {
  config: {
    show: ResourceRedirect,
    icon: NaturePeopleIcon,
    options: {
      label: 'Ressources'
    }
  },
  dataModel: {
    types: ['pair:Skill']
  },
  translations: {
    fr: {
      name: 'Ressource |||| Ressources'
    }
  }
};
