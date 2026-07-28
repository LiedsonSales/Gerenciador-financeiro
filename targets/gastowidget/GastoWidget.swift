import WidgetKit
import SwiftUI

struct GastoEntry: TimelineEntry {
    let date: Date
}

struct GastoProvider: TimelineProvider {
    func placeholder(in context: Context) -> GastoEntry {
        GastoEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (GastoEntry) -> Void) {
        completion(GastoEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GastoEntry>) -> Void) {
        let entry = GastoEntry(date: Date())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
}

struct GastoWidgetView: View {
    var body: some View {
        Link(destination: URL(string: "gerenciadorfinanceiro://adicionar")!) {
            VStack {
                Image(systemName: "plus.circle.fill")
                    .font(.title2)
                Text("Add. Gasto")
                    .font(.caption2)
            }
        }
        .containerBackground(for: .widget) {
            Color.clear
        }
    }
}

struct GastoWidget: Widget {
    let kind: String = "GastoWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: GastoProvider()) { entry in
            GastoWidgetView()
        }
        .configurationDisplayName("Adicionar Gasto")
        .description("Toque para registrar um gasto rapidamente.")
        .supportedFamilies([.accessoryCircular, .accessoryRectangular])
    }
}

@main
struct GastoWidgetBundle: WidgetBundle {
    var body: some Widget {
        GastoWidget()
    }
}