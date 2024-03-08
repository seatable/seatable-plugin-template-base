import React from 'react';

// @ts-nocheck
// @ts-ignore
const CustomPlugin = ({ pluginPresets, appActiveState, activeViewRows }) => (
  <>
    {pluginPresets.map(
      (obj: {
        _id: React.Key | null | undefined;
        name: any;
        settings: { selectedTable: { label: any }; selectedView: { label: any } };
      }) => (
        <div
          key={obj._id}
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#fff',
          }}>
          <div style={{ fontWeight: 'bold' }}>{`Preset ID: ${obj._id}`}</div>
          <div style={{ color: '#007bff' }}>{`Preset Name: ${obj.name}`}</div>
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Settings:</div>
          <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedTableId: ${
            obj.settings?.selectedTable?.label ?? 'N/A'
          }`}</div>
          <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedViewId: ${
            obj.settings?.selectedView?.label ?? 'N/A'
          }`}</div>
        </div>
      )
    )}
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
      }}>
      <div
        style={{
          color: '#ff6666',
        }}>{`Active Table: ${appActiveState.activeTableName}`}</div>
      <div
        style={{
          color: '#ff6666',
        }}>{`Active View: ${appActiveState?.activeTableView?.name}`}</div>
    </div>
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
      }}>
      <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Rows of this selection:</div>
      <div>
        {activeViewRows?.map(
          (row: {
            [x: string]:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
            _id: React.Key | null | undefined;
          }) => (
            <div key={row._id}>
              <h6>{row['0000']}</h6>
            </div>
          )
        )}
      </div>
    </div>
  </>
);

export default CustomPlugin;
