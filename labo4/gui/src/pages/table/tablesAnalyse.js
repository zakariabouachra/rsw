import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Paper } from '@mui/material';
import { Bar, Line, Pie, Radar  } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

const TableAnalyse = () => {
  const [tableDescription, setTableDescription] = useState(null);
  const { databaseName, schemaName, tableName } = useParams();
  const [currentTableName] = useState(tableName);
  const [currentDatabaseName] = useState(databaseName);
  const [currentSchemaName] = useState(schemaName);

const fetchTableDescription = () => {
  axios
    .get(
      `http://localhost:5000/analyse/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/description`
    )
    .then((response) => {
      console.log(response.data.table_description);
      const tableDescription = response.data.table_description;
      if (tableDescription !== undefined) {
        setTableDescription(tableDescription);
        localStorage.setItem(`table_description_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(tableDescription));
      } else {
        console.error("tableDescription est indéfini");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

useEffect(() => {
  const storedTableDescription = localStorage.getItem(`table_description_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);

  if (storedTableDescription !== undefined) {
    const tableDescription = JSON.parse(storedTableDescription);
    setTableDescription(tableDescription);
  } else {
    fetchTableDescription();
  }
}, []);



  // Fonction pour créer un graphique en barres
  const createBarChart = () => {
    if (tableDescription) {
        const countValues = Object.values(tableDescription).map(item => item.count);

        const data = {
        labels: Object.keys(tableDescription), // Utilisez les noms des statistiques comme étiquettes
        datasets: [
          {
            label: 'Valeurs',
            data: countValues, // Utilisez les valeurs des statistiques comme données
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      return (
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Graphique en barres base sur le count
          </Typography>
          <Bar data={data} options={options} />
        </Paper>
      );
    }
    return null;
  };

  // Fonction pour créer un graphique en ligne basé sur 'freq'
const createLineChart = () => {
    if (tableDescription) {
      // Obtenez les valeurs 'freq' de chaque sous-objet
      const freqValues = Object.values(tableDescription).map(item => item.freq);
  
      const data = {
        labels: Object.keys(tableDescription), // Utilisez les noms des statistiques comme étiquettes
        datasets: [
          {
            label: 'Valeurs',
            data: freqValues, // Utilisez les valeurs 'freq' comme données
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      };
  
      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
  
      return (
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Graphique en ligne basé sur frequence
          </Typography>
          <Line data={data} options={options} />
        </Paper>
      );
    }
    return null;
  };
  
  // Fonction pour créer un graphique à secteurs
  const createPieChart = () => {
    if (tableDescription) {
    const top = Object.values(tableDescription).map(item => item.top);

      const data = {
        labels: Object.keys(tableDescription), // Utilisez les noms des statistiques comme étiquettes
        datasets: [
          {
            data: top, // Utilisez les valeurs des statistiques comme données
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      return (
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Graphique à secteurs base sur le top
          </Typography>
          <Pie data={data} />
        </Paper>
      );
    }
    return null;
  };

  // Fonction pour créer un graphique radar
  const createRadarChart = () => {
    if (tableDescription) {
        const unique = Object.values(tableDescription).map(item => item.unique);

      const data = {
        labels: Object.keys(tableDescription), // Utilisez les noms des statistiques comme étiquettes
        datasets: [
          {
            label: 'Valeurs',
            data: unique, // Utilisez les valeurs des statistiques comme données
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      };

      return (
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Graphique radar sur unique
          </Typography>
          <Radar data={data} options={options} />
        </Paper>
      );
    }
    return null;
  };

  

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        {tableDescription ? (
          createBarChart()
        ) : (
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Graphique en barres base sur le count
            </Typography>
            <Typography>Aucune donnée disponible</Typography>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        {tableDescription ? (
          createLineChart()
        ) : (
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Graphique en ligne basé sur fréquence
            </Typography>
            <Typography>Aucune donnée disponible</Typography>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        {tableDescription ? (
          createPieChart()
        ) : (
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Graphique à secteurs basé sur le top
            </Typography>
            <Typography>Aucune donnée disponible</Typography>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        {tableDescription ? (
          createRadarChart()
        ) : (
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Graphique radar sur unique
            </Typography>
            <Typography>Aucune donnée disponible</Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  )
  
};

export default TableAnalyse;
