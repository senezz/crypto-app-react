import {
  Typography,
  Flex,
  Divider,
  Form,
  InputNumber,
  Button,
  Modal
} from 'antd'

import { useCrypto } from '../context/crypto-context'
import CoinInfo from './CoinInfo'

const validateMessages = {
    required: '${label} is required!',
    types: { number: '${label} in not valid number', },
    number: { range: '${label} must be between ${min} and ${max}', },
}

export default function SellAssetForm({ asset, open, onClose }) {
    const [form] = Form.useForm()
    const { crypto, sellAsset } = useCrypto()
    const coin = crypto.find((c) => c.id === asset.id)


    function minValueOfCoin() {
        return 10e-8
    }

    function onFinish(values) {
        sellAsset(asset.id, values.amount)
        onClose()
    }

    function handleAmountChange(amount) {
            form.setFieldValue('amount', amount)
        }

    return (
        <Modal 
        open={open} 
        onCancel={onClose} 
        footer={null} 
        title="Confirm Sell Asset" 
        destroyOnHidden
        >
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 10,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                amount: 0,
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >
            <CoinInfo coin={coin} withSymbol/>
            <Divider />
            <Typography.Paragraph>
                    You currently hold{' '}
                <Typography.Text strong>{asset.amount} {asset.name}</Typography.Text>{' '}
                    at the current price of{' '}
                <Typography.Text strong>${coin.price.toFixed(2)}</Typography.Text> per coin.
            </Typography.Paragraph>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                {
                    required: true,
                    type: 'number',
                    min: minValueOfCoin(),
                    max: asset.amount
                },
                ]}
            >
            <InputNumber
            placeholder="Enter coin amount"
            onChange={handleAmountChange}
            style={{ width: '100%' }}
            min={0}
            max={asset.amount}
            step={0.01}
            />
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ span: 24 }}>
        <Flex gap="small" justify="flex-end" style={{ width: '100%' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" danger htmlType="submit">Sell</Button>
        </Flex>
      </Form.Item>
        </Form>
        </Modal>
    )
}
