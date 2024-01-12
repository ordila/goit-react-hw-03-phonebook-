import { Component } from 'react';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import { ContactSingle } from './ContactForm/ContactForm.types';
import users from '../data/users.json';
import { localStorageService } from '../helpers/storage/storage.helpers';
import { LOCAL_STORAGE_KEYS } from '../constants/storage/localStorageKeys.constants';

const userService = localStorageService<ContactSingle[]>(
  LOCAL_STORAGE_KEYS.USERS
);

interface State {
  contacts: ContactSingle[];
  filter: string;
}

export class App extends Component<{}, State> {
  state = {
    contacts: users,
    filter: '',
  };

  handleAddContact = (newContact: ContactSingle) => {
    if (this.handleCheckUniqueContact(newContact.name)) {
      this.setState(({ contacts }) => ({
        contacts: [...contacts, newContact],
      }));
    }
  };

  handleCheckUniqueContact = (name: string) => {
    const { contacts } = this.state;
    const isExistContact = !!contacts.find(
      contact => contact.name.toUpperCase() === name.toUpperCase()
    );
    isExistContact && alert('Contact is already exist');
    return !isExistContact;
  };

  handleRemoveContact = (id: string) => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  handleFilterChange = (filter: string) => this.setState({ filter });

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  componentDidMount() {
    if (localStorage) {
      const data = userService.getItem();
      if (data) {
        this.setState({ contacts: data });
      }
    }
  }

  componentDidUpdate(_: {}, prevState: State) {
    if (localStorage && prevState.contacts !== this.state.contacts) {
      userService.setItem(this.state.contacts);
    }
  }

  render() {
    return (
      <div>
        <h2>Contact Form</h2>
        <ContactForm onAdd={this.handleAddContact} />
        <h2>Filter</h2>
        <Filter filter={this.state.filter} onChange={this.handleFilterChange} />
        <h2>Contacts</h2>
        {this.state.contacts && (
          <ContactList
            contacts={this.getVisibleContacts()}
            onRemove={this.handleRemoveContact}
          />
        )}
      </div>
    );
  }
}
