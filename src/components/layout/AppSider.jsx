import { Layout, Card, Statistic, List, Typography, Tag, Button, Flex, Space } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { capitalize, sellCoin, sellAllCoins } from '../../utils'
import { useContext } from 'react';
import CryptoContext from '../../context/crypto-context';

const siderStyle = {
  padding: '1rem',
};

export default function AppSider() {
  const { portfolio } = useContext(CryptoContext)

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {portfolio.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: '1rem' }}> 
          <Statistic
            title={
            <div style={{ display: "flex", justifyContent: "space-between",  alignItems: 'center'}}>
              <span>{capitalize(asset.id)}</span>
              <Space>
                <Button onClick={sellCoin}>
                  Sell
                </Button>
                <Button onClick={sellAllCoins}> 
                  Sell All
                </Button>
              </Space>
            </div>
            }
            value={asset.totalAmount}
            precision={2}
            styles={{ content: { color: asset.grow ? '#3f8600' : '#cf1322' } }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            size="small"
            dataSource={[
              {
                title: 'Total Profit',
                value: asset.totalProfit,
                withTag: true,
              },
              { title: 'Asset Amount', value: asset.amount, isPlain: true },
              // { title: 'Difference', value: asset.growPercent },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? 'green' : 'red'}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value}
                  {!item.isPlain && (
                    <Typography.Text type={asset.grow ? 'success' : 'danger'}>
                      {item.value.toFixed(2)}$
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Layout.Sider>
  )
}