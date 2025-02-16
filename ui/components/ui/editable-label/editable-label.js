import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  AlignItems,
  Color,
  DISPLAY,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { getAccountNameErrorMessage } from '../../../helpers/utils/accounts';
import { ButtonIcon, FormTextField, IconName } from '../../component-library';
import { Text } from '../../component-library/text/deprecated';
import Box from '../box/box';

export default class EditableLabel extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    accounts: PropTypes.array,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    isEditing: false,
    value: this.props.defaultValue || '',
  };

  async handleSubmit(isValidAccountName) {
    if (!isValidAccountName) {
      return;
    }

    await this.props.onSubmit(this.state.value);
    this.setState({ isEditing: false });
  }

  renderEditing() {
    const { isValidAccountName, errorMessage } = getAccountNameErrorMessage(
      this.props.accounts,
      this.context,
      this.state.value,
      this.props.defaultValue,
    );

    return (
      <Box
        className={classnames('editable-label', this.props.className)}
        display={DISPLAY.FLEX}
        gap={3}
      >
        <FormTextField
          required
          value={this.state.value}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              this.handleSubmit(isValidAccountName);
            }
          }}
          onChange={(event) => {
            this.setState({ value: event.target.value });
          }}
          data-testid="editable-input"
          error={!isValidAccountName}
          helpText={errorMessage}
          autoFocus
          placeholder={this.context.t('accountName')}
        />
        <ButtonIcon
          iconName={IconName.Check}
          onClick={() => this.handleSubmit(isValidAccountName)}
        />
      </Box>
    );
  }

  renderReadonly() {
    return (
      <Box display={DISPLAY.FLEX} alignItems={AlignItems.center} gap={3}>
        <Text variant={TextVariant.bodyLgMedium}>{this.state.value}</Text>
        <ButtonIcon
          iconName={IconName.Edit}
          ariaLabel={this.context.t('edit')}
          data-testid="editable-label-button"
          onClick={() => this.setState({ isEditing: true })}
          color={Color.iconDefault}
        />
      </Box>
    );
  }

  render() {
    return this.state.isEditing ? this.renderEditing() : this.renderReadonly();
  }
}
