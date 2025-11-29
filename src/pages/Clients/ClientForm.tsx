import { Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';

type ClientFormProps = {
  form: FormInstance;
};

export const ClientForm = ({ form }: ClientFormProps) => {
  return (
    <Form 
      form={form} 
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item 
        name="firstName" 
        label="First Name" 
        rules={[
          { required: true, message: 'Please inform the first name.' },
          { min: 2, message: 'First name should have at least 2 characters.' }
        ]}
      >
        <Input placeholder="John" />
      </Form.Item>
      
      <Form.Item 
        name="lastName" 
        label="Last Name" 
        rules={[
          { required: true, message: 'Please inform the last name.' },
          { min: 2, message: 'Last name should have at least 2 characters.' }
        ]}
      >
        <Input placeholder="Doe" />
      </Form.Item>
      
      <Form.Item 
        name="email" 
        label="E-mail" 
        rules={[
          { required: true, message: 'Please inform the e-mail.' },
          { type: 'email', message: 'Please enter a valid e-mail.' }
        ]}
      >
        <Input placeholder="john@gmail.com" />
      </Form.Item>
      
      <Form.Item 
        name="street" 
        label="Street" 
        rules={[
          { required: true, message: 'Please inform the street.' },
          { min: 3, message: 'Street should have at least 3 characters.' }
        ]}
      >
        <Input placeholder="New Road" />
      </Form.Item>
      
      <Form.Item 
        name="number" 
        label="Number" 
        rules={[
          { required: true, message: 'Please inform the number.' }
        ]}
      >
        <Input placeholder="7682" />
      </Form.Item>
      
      <Form.Item 
        name="zipCode" 
        label="Zip Code" 
        rules={[
          { required: true, message: 'Please inform the zip code.' }
        ]}
      >
        <Input placeholder="12926-3874" />
      </Form.Item>
      
      <Form.Item 
        name="city" 
        label="City" 
        rules={[
          { required: true, message: 'Please inform the city.' },
          { min: 2, message: 'City should have at least 2 characters.' }
        ]}
      >
        <Input placeholder="Kilcoole" />
      </Form.Item>
      
      <Form.Item 
        name="phone" 
        label="Phone" 
        rules={[
          { required: true, message: 'Please inform the phone.' }
        ]}
      >
        <Input placeholder="1-570-236-7033" />
      </Form.Item>
    </Form>
  );
};