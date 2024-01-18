import { useRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { withTranslation } from 'react-i18next'
import { Input, Card } from 'reactstrap';
import Icon, { IconName } from '@ailibs/feather-react-ts';
import ConfigurationModal from "src/components/Common/ConfigurationModal";
import { deleteUserFromApi, getRoles, getUsers, pushUserToApi } from 'src/helpers/api_helper';

function ucfirst(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

export interface IUserInfoActionButton {
  iconName: IconName;
  onClick(): any;
}

export const UserInfoActionButton = (props: IUserInfoActionButton) => (
  <div style={{ paddingLeft: '20px'}}>
    <button onClick={e => props.onClick()} style={{ background: 'inherit', border: 'none' }}>
      <Icon
        name={props.iconName}
        size={20}
      />
    </button>
  </div>
)

interface IUserInfoTextField {
  value: string;
  onChange(event: any): any;
  isEditMode: boolean;
}

const UserInfoTextField = (props: IUserInfoTextField) =>
  props.isEditMode
    ? (
      <div style={{ marginRight: '40px' }}>
        <Input value={props.value} onChange={e => props.onChange(e.target.value)} bsSize="sm" />
      </div>
    )
    : <span>{props.value}</span>
;

interface IUserInfoSelectField {
  options: {
    [key: string]: string;
  };
  value: string;
  onChange(key: string): any;
  isEditMode: boolean;
}

const UserInfoSelectField = (props: IUserInfoSelectField) =>
  props.isEditMode
  ? (
    <div style={{ marginRight: '40px' }}>
      <Input type="select" bsSize='sm' value={props.value} onChange={e => props.onChange(e.target.value)}>
        {Object.entries(props.options).map(([key, value]) => (
          <option value={key} key={key}>{value}</option>
        ))}
      </Input>
    </div>
  )
  : <span>{props.options[props.value]}</span>
;


interface IUserInfoField {
  title?: string;
  children: any;
}

const UserInfoField = (props: IUserInfoField) => {
  return (
    <div style={{ flex: '1' }}>
      {props.title !== undefined
        ? <span style={{ color: '#bbb', fontSize: '0.9em' }}>{props.title}</span>
        : null
      }
      <div>{props.children}</div>
    </div>
  )
}

interface IUserInfoEntry {
  user: any;
  existingRoles: any;
  onDeleteUser: any;
  isEditMode: boolean;
  t: any;
}

const UserInfoEntry = forwardRef((props: IUserInfoEntry, ref: any) => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const { _id, email, slug, name, emailConfirmed, avatarUrl, externalServiceId } = props.user
    const role = props.user.role._id
    setUser({ _id, email, slug, name, emailConfirmed, role, avatarUrl, externalServiceId });
  }, [props.user]);

  useImperativeHandle(ref, () => ({
    save: async () => {
      const { slug, name, role } = user
      const payload = { slug, name, role }
      pushUserToApi(user._id, payload);
    }
  }));

  if (user === null) {
    return null;
  }

  return (
    <Card body>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: '20px' }}>
          <img src={user.avatarUrl} width={40} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>  
            <UserInfoField title={props.t('Username')}>
              <UserInfoTextField
                value={user.name}
                onChange={value => setUser({ ...user, name: value })}
                isEditMode={props.isEditMode}
              />
            </UserInfoField>

            <UserInfoField title={props.t('E-mail address')}>
              {user.email}
            </UserInfoField>

            <UserInfoField title={props.t('Role')}>
              <UserInfoSelectField
                options={props.existingRoles}
                value={user.role}
                onChange={value => setUser({ ...user, role: value })}
                isEditMode={props.isEditMode}
              />
            </UserInfoField>

            <UserInfoField title={props.t('Registration method')}>
              {user.externalServiceId ? ucfirst(user.externalServiceId.service) : props.t('Registration form')}
            </UserInfoField>

            <UserInfoField title={props.t('Confirmed e-mail address')}>
              {props.user.emailConfirmed ? props.t('Yes') : props.t('No')}
            </UserInfoField>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserInfoActionButton
              iconName="trash-2"
              onClick={props.onDeleteUser}
            />
          </div>
        </div>
      </div>
    </Card>
  )
})


interface IUsersManager {
  onClose(): any;
  t: any;
}

const UsersManager = (props: IUsersManager) => {
  const userTilesRef = useRef<any>([]);

  const [existingRoles, setExistingRoles] = useState([]);
  const existingRolesObject = Object.fromEntries(existingRoles.map((e: any) => [e._id, e.name]));

  const [users, setUsers] = useState<any[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  useEffect(() => {
    getRoles().then(roles => setExistingRoles(roles));
    getUsers().then(users => setUsers(users));
  }, []);

  useEffect(() => {
    userTilesRef.current = userTilesRef.current.slice(0, users.length);
  }, [users]);

  function deleteUser(index: number) {
    const deletedUser = users[index];
    setDeletedUsers([...deletedUsers, deletedUser]);
    setUsers([...users.slice(0, index), ...users.slice(index + 1)]);
  }

  return (
    <ConfigurationModal
      title={props.t('Users Manager')}
      onSave={async () => {
        await Promise.all(userTilesRef.current.map((tile: any) => tile.save()));
        await Promise.all(deletedUsers.map((user: any) => deleteUserFromApi(user._id)));
        props.onClose();
      }}
      onCancel={props.onClose}
      actions={[
          <UserInfoActionButton iconName={isEditMode ? 'eye' : 'edit'} onClick={toggleEditMode} key={1} />
      ]}
      fullscreen
    >
      {users.map((user, index) => (
        <UserInfoEntry
          user={user}
          existingRoles={existingRolesObject}
          isEditMode={isEditMode}
          ref={(e: any) => userTilesRef.current[index] = e}
          onDeleteUser={() => deleteUser(index)}
          key={user._id}
          t={props.t}
        />
      ))}
    </ConfigurationModal>
  );
}

export default withTranslation()(UsersManager);
