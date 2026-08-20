const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PACOTE_PATH = 'com/anonymous/gerenciadorfinanceiro';

// ---------- Quick Settings Tile (já existia) ----------

const TILE_SERVICE_KOTLIN = `package com.anonymous.gerenciadorfinanceiro

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

class GastoTileService : TileService() {

    override fun onStartListening() {
        super.onStartListening()
        qsTile?.state = Tile.STATE_ACTIVE
        qsTile?.label = "Adicionar Gasto"
        qsTile?.updateTile()
    }

    override fun onClick() {
        super.onClick()
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("gerenciadorfinanceiro://adicionar")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            val pendingIntent = PendingIntent.getActivity(
                this, 0, intent, PendingIntent.FLAG_IMMUTABLE
            )
            startActivityAndCollapse(pendingIntent)
        } else {
            @Suppress("DEPRECATION")
            startActivityAndCollapse(intent)
        }
    }
}
`;

const TILE_ICON_XML = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
</vector>
`;

// ---------- Home Screen Widget (novo) ----------

const WIDGET_PROVIDER_KOTLIN = `package com.anonymous.gerenciadorfinanceiro

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

class GastoWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_gasto)

            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("gerenciadorfinanceiro://adicionar")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
`;

const WIDGET_LAYOUT_XML = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#3E7BC4"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="+"
        android:textColor="#FFFFFF"
        android:textSize="28sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Adicionar Gasto"
        android:textColor="#FFFFFF"
        android:textSize="13sp"
        android:layout_marginTop="4dp" />

</LinearLayout>
`;

const WIDGET_INFO_XML = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="110dp"
    android:minHeight="110dp"
    android:targetCellWidth="2"
    android:targetCellHeight="2"
    android:updatePeriodMillis="0"
    android:initialLayout="@layout/widget_gasto"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
`;

// ---------- Escrita de arquivos ----------

function withNativeFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const root = config.modRequest.platformProjectRoot;

      const javaDir = path.join(root, 'app/src/main/java', PACOTE_PATH);
      fs.mkdirSync(javaDir, { recursive: true });
      fs.writeFileSync(path.join(javaDir, 'GastoTileService.kt'), TILE_SERVICE_KOTLIN);
      fs.writeFileSync(path.join(javaDir, 'GastoWidgetProvider.kt'), WIDGET_PROVIDER_KOTLIN);

      const drawableDir = path.join(root, 'app/src/main/res/drawable');
      fs.mkdirSync(drawableDir, { recursive: true });
      fs.writeFileSync(path.join(drawableDir, 'ic_tile.xml'), TILE_ICON_XML);

      const layoutDir = path.join(root, 'app/src/main/res/layout');
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.writeFileSync(path.join(layoutDir, 'widget_gasto.xml'), WIDGET_LAYOUT_XML);

      const xmlDir = path.join(root, 'app/src/main/res/xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(path.join(xmlDir, 'widget_gasto_info.xml'), WIDGET_INFO_XML);

      return config;
    },
  ]);
}

function withManifestEntries(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    // Tile (já existia)
    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    const tileJaExiste = mainApplication.service.some(
      (s) => s.$['android:name'] === '.GastoTileService'
    );
    if (!tileJaExiste) {
      mainApplication.service.push({
        $: {
          'android:name': '.GastoTileService',
          'android:label': 'Adicionar Gasto',
          'android:icon': '@drawable/ic_tile',
          'android:permission': 'android.permission.BIND_QUICK_SETTINGS_TILE',
          'android:exported': 'true',
        },
        'intent-filter': [
          { action: [{ $: { 'android:name': 'android.service.quicksettings.action.QS_TILE' } }] },
        ],
      });
    }

    // Widget (novo)
    if (!mainApplication.receiver) {
      mainApplication.receiver = [];
    }
    const widgetJaExiste = mainApplication.receiver.some(
      (r) => r.$['android:name'] === '.GastoWidgetProvider'
    );
    if (!widgetJaExiste) {
      mainApplication.receiver.push({
        $: {
          'android:name': '.GastoWidgetProvider',
          'android:exported': 'true',
        },
        'intent-filter': [
          { action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }] },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.appwidget.provider',
              'android:resource': '@xml/widget_gasto_info',
            },
          },
        ],
      });
    }

    return config;
  });
}

module.exports = function withGastoNativeExtras(config) {
  config = withNativeFiles(config);
  config = withManifestEntries(config);
  return config;
};